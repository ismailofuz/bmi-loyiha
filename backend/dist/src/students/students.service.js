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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const knex_1 = require("knex");
const database_provider_1 = require("../database/database.provider");
const role_enum_1 = require("../common/enums/role.enum");
let StudentsService = class StudentsService {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    async enroll(dto, requester) {
        if (requester.role === role_enum_1.Role.UniversityStaff &&
            dto.university_id !== requester.universityId) {
            throw new common_1.ForbiddenException('Cannot enroll student for another university');
        }
        const existing = await this.knex('students').where({ email: dto.email }).first();
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        return this.knex.transaction(async (trx) => {
            const password_hash = await bcrypt.hash(dto.password, 10);
            const [student] = await trx('students').insert({
                university_id: dto.university_id,
                full_name: dto.full_name,
                passport_serial: dto.passport_serial,
                pin: dto.pin,
                faculty_id: dto.faculty_id,
                direction_id: dto.direction_id,
                course_id: dto.course_id,
                group_id: dto.group_id,
                edu_form_id: dto.edu_form_id,
                edu_type_id: dto.edu_type_id,
                edu_lang_id: dto.edu_lang_id,
                email: dto.email,
                password_hash,
            }).returning('*');
            return student;
        });
    }
    async create(dto, requester) {
        if (requester.role === role_enum_1.Role.UniversityStaff &&
            dto.university_id !== requester.universityId) {
            throw new common_1.ForbiddenException('Cannot create student for another university');
        }
        const existing = await this.knex('students').where({ email: dto.email }).first();
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const { password, ...studentData } = dto;
        const password_hash = await bcrypt.hash(password, 10);
        const [student] = await this.knex('students').insert({ ...studentData, password_hash }).returning('*');
        return student;
    }
    async findAll(requester) {
        const query = this.knex('students as s')
            .leftJoin('universities as uni', 's.university_id', 'uni.id')
            .select('s.*', 'uni.name as university_name');
        if (requester.role === role_enum_1.Role.UniversityStaff) {
            query.where('s.university_id', requester.universityId);
        }
        else if (requester.role === role_enum_1.Role.Student) {
            query.where('s.id', requester.sub);
        }
        return query;
    }
    async findOne(id, requester) {
        this.assertAccess(id, requester);
        const student = await this.knex('students as s')
            .leftJoin('universities as uni', 's.university_id', 'uni.id')
            .where('s.id', id)
            .select('s.*', 'uni.name as university_name')
            .first();
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return student;
    }
    async update(id, dto, requester) {
        this.assertAccess(id, requester);
        await this.findOne(id, requester);
        const [updated] = await this.knex('students')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        return updated;
    }
    async assertAccess(studentId, requester) {
        if (requester.role === role_enum_1.Role.SuperAdmin)
            return;
        const student = await this.knex('students').where({ id: studentId }).first();
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        if (requester.role === role_enum_1.Role.UniversityStaff &&
            student.university_id !== requester.universityId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (requester.role === role_enum_1.Role.Student &&
            studentId !== requester.sub) {
            throw new common_1.ForbiddenException('Access denied');
        }
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], StudentsService);
//# sourceMappingURL=students.service.js.map