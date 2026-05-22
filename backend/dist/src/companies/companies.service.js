"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const knex_1 = require("knex");
const database_provider_1 = require("../database/database.provider");
const role_enum_1 = require("../common/enums/role.enum");
let CompaniesService = class CompaniesService {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    async create(dto) {
        const { admin_email, admin_password, admin_name, ...companyData } = dto;
        const existing = await this.knex('company_mentors').where({ email: admin_email }).first();
        if (existing)
            throw new common_1.ConflictException('Bu email allaqachon ishlatilgan');
        return this.knex.transaction(async (trx) => {
            const [company] = await trx('companies').insert(companyData).returning('*');
            const password_hash = await bcrypt.hash(admin_password, 10);
            const [mentor] = await trx('company_mentors').insert({
                company_id: company.id,
                full_name: admin_name ?? null,
                email: admin_email,
                password_hash,
                is_admin: true,
            }).returning('*');
            return { ...company, admin_email: mentor.email };
        });
    }
    async findAll(requester) {
        const query = this.knex('companies').select('*');
        if (requester.role === role_enum_1.Role.CompanyMentor) {
            query.where({ id: requester.companyId });
        }
        return query;
    }
    async findOne(id, requester) {
        this.assertAccess(id, requester);
        const company = await this.knex('companies').where({ id }).first();
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async update(id, dto, requester) {
        this.assertAccess(id, requester);
        await this.findOne(id, requester);
        const [updated] = await this.knex('companies')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        return updated;
    }
    async enrollMentor(dto, requester) {
        if (requester.role === role_enum_1.Role.CompanyMentor &&
            dto.company_id !== requester.companyId) {
            throw new common_1.ForbiddenException('Cannot enroll mentor for another company');
        }
        if (requester.role === role_enum_1.Role.CompanyMentor && !requester.isAdmin) {
            throw new common_1.ForbiddenException('Only company admin can enroll mentors');
        }
        const existing = await this.knex('company_mentors').where({ email: dto.email }).first();
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        return this.knex.transaction(async (trx) => {
            const password_hash = await bcrypt.hash(dto.password, 10);
            const [mentor] = await trx('company_mentors').insert({
                company_id: dto.company_id,
                full_name: dto.full_name,
                phone: dto.phone,
                email: dto.email,
                password_hash,
            }).returning('*');
            return mentor;
        });
    }
    async findMentors(companyId, requester) {
        this.assertAccess(companyId, requester);
        return this.knex('company_mentors')
            .where({ company_id: companyId })
            .select('id', 'full_name', 'phone', 'is_admin', 'email', 'is_active', 'created_at');
    }
    async updateMentor(mentorId, dto, requester) {
        const mentor = await this.knex('company_mentors').where({ id: mentorId }).first();
        if (!mentor)
            throw new common_1.NotFoundException('Mentor not found');
        this.assertAccess(mentor.company_id, requester);
        if (requester.role === role_enum_1.Role.CompanyMentor && !requester.isAdmin) {
            throw new common_1.ForbiddenException('Only company admin can edit mentors');
        }
        const { new_password, ...profileData } = dto;
        const update = { ...profileData, updated_at: this.knex.fn.now() };
        if (new_password)
            update.password_hash = await bcrypt.hash(new_password, 10);
        const [updated] = await this.knex('company_mentors')
            .where({ id: mentorId })
            .update(update)
            .returning('*');
        return updated;
    }
    async remove(id) {
        const deleted = await this.knex('companies').where({ id }).delete();
        if (!deleted)
            throw new common_1.NotFoundException('Company not found');
        return { deleted: true };
    }
    assertAccess(companyId, requester) {
        if (requester.role === role_enum_1.Role.CompanyMentor &&
            requester.companyId !== companyId) {
            throw new common_1.ForbiddenException('Access denied to this company');
        }
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map