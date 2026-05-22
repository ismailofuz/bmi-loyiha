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
exports.JournalService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const database_provider_1 = require("../database/database.provider");
const role_enum_1 = require("../common/enums/role.enum");
let JournalService = class JournalService {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    async create(dto, requester) {
        const [entry] = await this.knex('journal_entries')
            .insert({ ...dto, student_id: requester.sub })
            .returning('*');
        return entry;
    }
    async findAll(studentId, requester) {
        await this.assertReadAccess(studentId, requester);
        return this.knex('journal_entries')
            .where({ student_id: studentId })
            .orderBy('entry_date', 'desc');
    }
    async findOne(id, requester) {
        const entry = await this.knex('journal_entries').where({ id }).first();
        if (!entry)
            throw new common_1.NotFoundException('Journal entry not found');
        await this.assertReadAccess(entry.student_id, requester);
        return entry;
    }
    async update(id, dto, requester) {
        const entry = await this.knex('journal_entries').where({ id }).first();
        if (!entry)
            throw new common_1.NotFoundException('Journal entry not found');
        if (entry.student_id !== requester.sub) {
            throw new common_1.ForbiddenException('Cannot edit another student\'s journal');
        }
        const [updated] = await this.knex('journal_entries')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
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
exports.JournalService = JournalService;
exports.JournalService = JournalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], JournalService);
//# sourceMappingURL=journal.service.js.map