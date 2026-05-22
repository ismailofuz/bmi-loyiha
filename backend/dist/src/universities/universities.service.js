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
exports.UniversitiesService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const knex_1 = require("knex");
const database_provider_1 = require("../database/database.provider");
const role_enum_1 = require("../common/enums/role.enum");
let UniversitiesService = class UniversitiesService {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    async create(dto) {
        const { admin_email, admin_password, admin_name, ...universityData } = dto;
        const existing = await this.knex('university_staff').where({ email: admin_email }).first();
        if (existing)
            throw new common_1.ConflictException('Bu email allaqachon ishlatilgan');
        return this.knex.transaction(async (trx) => {
            const [university] = await trx('universities').insert(universityData).returning('*');
            const password_hash = await bcrypt.hash(admin_password, 10);
            const [staff] = await trx('university_staff').insert({
                university_id: university.id,
                full_name: admin_name ?? null,
                email: admin_email,
                password_hash,
                is_admin: true,
            }).returning('*');
            return { ...university, admin_email: staff.email };
        });
    }
    async findAll(requester) {
        const query = this.knex('universities').select('*');
        if (requester.role === role_enum_1.Role.UniversityStaff) {
            query.where({ id: requester.universityId });
        }
        return query;
    }
    async findOne(id, requester) {
        this.assertAccess(id, requester);
        const university = await this.knex('universities').where({ id }).first();
        if (!university)
            throw new common_1.NotFoundException('University not found');
        return university;
    }
    async update(id, dto, requester) {
        this.assertAccess(id, requester);
        await this.findOne(id, requester);
        const [updated] = await this.knex('universities')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        return updated;
    }
    async enrollStaff(dto, requester) {
        if (requester.role === role_enum_1.Role.UniversityStaff &&
            dto.university_id !== requester.universityId) {
            throw new common_1.ForbiddenException('Cannot enroll staff for another university');
        }
        if (requester.role === role_enum_1.Role.UniversityStaff && !requester.isAdmin) {
            throw new common_1.ForbiddenException('Only university admin can enroll staff');
        }
        const existing = await this.knex('university_staff').where({ email: dto.email }).first();
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        return this.knex.transaction(async (trx) => {
            const password_hash = await bcrypt.hash(dto.password, 10);
            const [staff] = await trx('university_staff').insert({
                university_id: dto.university_id,
                full_name: dto.full_name,
                phone: dto.phone,
                email: dto.email,
                password_hash,
                is_admin: requester.role === role_enum_1.Role.SuperAdmin ? (dto.is_admin ?? false) : false,
            }).returning('*');
            return staff;
        });
    }
    async findStaff(universityId, requester) {
        this.assertAccess(universityId, requester);
        return this.knex('university_staff')
            .where({ university_id: universityId })
            .select('id', 'full_name', 'phone', 'is_admin', 'permissions', 'email', 'is_active', 'created_at');
    }
    async updateStaff(staffId, dto, requester) {
        const staff = await this.knex('university_staff').where({ id: staffId }).first();
        if (!staff)
            throw new common_1.NotFoundException('Staff not found');
        this.assertAccess(staff.university_id, requester);
        if (requester.role === role_enum_1.Role.UniversityStaff && !requester.isAdmin) {
            throw new common_1.ForbiddenException('Only university admin can edit staff');
        }
        const { new_password, ...profileData } = dto;
        const update = { ...profileData, updated_at: this.knex.fn.now() };
        if (new_password)
            update.password_hash = await bcrypt.hash(new_password, 10);
        const [updated] = await this.knex('university_staff')
            .where({ id: staffId })
            .update(update)
            .returning('*');
        return updated;
    }
    async updateStaffPermissions(staffId, dto, requester) {
        const staff = await this.knex('university_staff').where({ id: staffId }).first();
        if (!staff)
            throw new common_1.NotFoundException('Staff not found');
        if (requester.role !== role_enum_1.Role.SuperAdmin) {
            const callerStaff = await this.knex('university_staff')
                .where({ id: requester.sub })
                .first();
            if (!callerStaff?.is_admin || callerStaff.university_id !== staff.university_id) {
                throw new common_1.ForbiddenException('Only university admin can manage permissions');
            }
        }
        const update = { updated_at: this.knex.fn.now() };
        if (dto.permissions !== undefined)
            update.permissions = JSON.stringify(dto.permissions);
        if (dto.is_admin !== undefined) {
            const callerCanToggle = requester.role === role_enum_1.Role.SuperAdmin || (() => {
                return true;
            })();
            if (callerCanToggle)
                update.is_admin = dto.is_admin;
        }
        const [updated] = await this.knex('university_staff')
            .where({ id: staffId })
            .update(update)
            .returning('*');
        return updated;
    }
    async remove(id) {
        const deleted = await this.knex('universities').where({ id }).delete();
        if (!deleted)
            throw new common_1.NotFoundException('University not found');
        return { deleted: true };
    }
    assertAccess(universityId, requester) {
        if (requester.role === role_enum_1.Role.UniversityStaff &&
            requester.universityId !== universityId) {
            throw new common_1.ForbiddenException('Access denied to this university');
        }
    }
};
exports.UniversitiesService = UniversitiesService;
exports.UniversitiesService = UniversitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], UniversitiesService);
//# sourceMappingURL=universities.service.js.map