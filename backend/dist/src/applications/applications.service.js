"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const database_provider_1 = require("../database/database.provider");
const role_enum_1 = require("../common/enums/role.enum");
let ApplicationsService = class ApplicationsService {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    async create(dto, requester) {
        const student = await this.knex('students').where({ id: dto.student_id }).first();
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        if (student.university_id !== requester.universityId) {
            throw new common_1.ForbiddenException('Student does not belong to your university');
        }
        const [app] = await this.knex('internship_applications')
            .insert({
            student_id: dto.student_id,
            company_id: dto.company_id,
            university_id: requester.universityId,
            supervisor_id: dto.supervisor_id ?? null,
            internship_start: dto.internship_start,
            internship_end: dto.internship_end,
        })
            .returning('*');
        return app;
    }
    async findAll(requester) {
        const query = this.knex('internship_applications as ia')
            .join('students as s', 'ia.student_id', 's.id')
            .join('companies as co', 'ia.company_id', 'co.id')
            .join('universities as uni', 'ia.university_id', 'uni.id')
            .leftJoin('university_staff as sup', 'ia.supervisor_id', 'sup.id')
            .select('ia.*', 's.full_name as student_name', 'co.name as company_name', 'uni.name as university_name', 'sup.full_name as supervisor_name')
            .orderBy('ia.created_at', 'desc');
        if (requester.role === role_enum_1.Role.UniversityStaff) {
            query.where('ia.university_id', requester.universityId);
        }
        else if (requester.role === role_enum_1.Role.CompanyMentor) {
            query.where('ia.company_id', requester.companyId);
        }
        return query;
    }
    async update(id, dto, requester) {
        const app = await this.knex('internship_applications').where({ id }).first();
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        if (app.university_id !== requester.universityId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.knex('internship_applications')
            .where({ id })
            .update({
            ...(dto.company_id !== undefined && { company_id: dto.company_id }),
            ...(dto.supervisor_id !== undefined && { supervisor_id: dto.supervisor_id }),
            internship_start: dto.internship_start,
            internship_end: dto.internship_end,
            updated_at: this.knex.fn.now(),
        });
        return this.knex('internship_applications').where({ id }).first();
    }
    async respond(id, dto, requester) {
        const app = await this.knex('internship_applications').where({ id }).first();
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        if (app.company_id !== requester.companyId) {
            throw new common_1.ForbiddenException('This application is not directed to your company');
        }
        if (app.status !== 'pending') {
            throw new common_1.ForbiddenException('Application has already been responded to');
        }
        await this.knex('internship_applications')
            .where({ id })
            .update({ status: dto.status, updated_at: this.knex.fn.now() });
        return this.knex('internship_applications').where({ id }).first();
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map