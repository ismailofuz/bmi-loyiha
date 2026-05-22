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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const database_provider_1 = require("../database/database.provider");
const role_enum_1 = require("../common/enums/role.enum");
let ReportsService = class ReportsService {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    async create(dto, requester) {
        const [report] = await this.knex('reports')
            .insert({ ...dto, student_id: requester.sub, status: 'draft' })
            .returning('*');
        return report;
    }
    async findAll(studentId, requester) {
        await this.assertReadAccess(studentId, requester);
        return this.knex('reports')
            .where({ student_id: studentId })
            .orderBy('week_number', 'asc');
    }
    async findOne(id, requester) {
        const report = await this.knex('reports').where({ id }).first();
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        await this.assertReadAccess(report.student_id, requester);
        return report;
    }
    async update(id, dto, requester) {
        const report = await this.knex('reports').where({ id }).first();
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        if (report.student_id !== requester.sub) {
            throw new common_1.ForbiddenException('Cannot edit another student\'s report');
        }
        if (report.status === 'approved') {
            throw new common_1.BadRequestException('Cannot edit an approved report');
        }
        const [updated] = await this.knex('reports')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        return updated;
    }
    async review(id, dto, requester) {
        const report = await this.knex('reports').where({ id }).first();
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        if (report.status !== 'submitted') {
            throw new common_1.BadRequestException('Only submitted reports can be reviewed');
        }
        await this.assertReadAccess(report.student_id, requester);
        const [updated] = await this.knex('reports')
            .where({ id })
            .update({
            status: dto.status,
            reviewer_feedback: dto.reviewer_feedback ?? null,
            reviewed_by: requester.sub,
            reviewed_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
        })
            .returning('*');
        return updated;
    }
    async assertReadAccess(studentId, requester) {
        if (requester.role === role_enum_1.Role.SuperAdmin)
            return;
        if (requester.role === role_enum_1.Role.Student && requester.sub !== studentId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (requester.role === role_enum_1.Role.UniversityStaff) {
            const student = await this.knex('students').where({ id: studentId }).first();
            if (!student || student.university_id !== requester.universityId) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        if (requester.role === role_enum_1.Role.CompanyMentor) {
            const student = await this.knex('students').where({ id: studentId }).first();
            if (!student || student.company_id !== requester.companyId) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], ReportsService);
//# sourceMappingURL=reports.service.js.map