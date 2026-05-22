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
exports.InternshipsService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const database_provider_1 = require("../database/database.provider");
const role_enum_1 = require("../common/enums/role.enum");
let InternshipsService = class InternshipsService {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    async create(dto, requester) {
        const [internship] = await this.knex('internships')
            .insert({
            company_id: dto.company_id,
            university_id: requester.universityId,
            supervisor_id: dto.supervisor_id ?? null,
            internship_start: dto.internship_start,
            internship_end: dto.internship_end,
        })
            .returning('*');
        return internship;
    }
    async findAll(requester) {
        const query = this.knex('internships as i')
            .join('companies as co', 'i.company_id', 'co.id')
            .leftJoin('university_staff as sup', 'i.supervisor_id', 'sup.id')
            .select('i.*', 'co.name as company_name', 'sup.full_name as supervisor_name')
            .orderBy('i.created_at', 'desc');
        if (requester.role === role_enum_1.Role.UniversityStaff) {
            query.where('i.university_id', requester.universityId);
        }
        else if (requester.role === role_enum_1.Role.CompanyMentor) {
            query.where('i.company_id', requester.companyId);
        }
        return query;
    }
    async findOne(id, requester) {
        const internship = await this.knex('internships as i')
            .join('companies as co', 'i.company_id', 'co.id')
            .leftJoin('university_staff as sup', 'i.supervisor_id', 'sup.id')
            .where('i.id', id)
            .select('i.*', 'co.name as company_name', 'sup.full_name as supervisor_name')
            .first();
        if (!internship)
            throw new common_1.NotFoundException('Amaliyot topilmadi');
        this.assertInternshipAccess(internship, requester);
        return internship;
    }
    async update(id, dto, requester) {
        const internship = await this.knex('internships').where({ id }).first();
        if (!internship)
            throw new common_1.NotFoundException('Amaliyot topilmadi');
        if (internship.university_id !== requester.universityId)
            throw new common_1.ForbiddenException('Ruxsat yo\'q');
        const [updated] = await this.knex('internships')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        return updated;
    }
    async cancel(id, requester) {
        const internship = await this.knex('internships').where({ id }).first();
        if (!internship)
            throw new common_1.NotFoundException('Amaliyot topilmadi');
        if (internship.university_id !== requester.universityId)
            throw new common_1.ForbiddenException('Ruxsat yo\'q');
        if (internship.status === 'accepted')
            throw new common_1.ForbiddenException('Tasdiqlangan shartnomani bekor qilib bo\'lmaydi');
        await this.knex('internships').where({ id }).update({ status: 'cancelled', updated_at: this.knex.fn.now() });
        return this.knex('internships').where({ id }).first();
    }
    async respond(id, dto, requester) {
        const internship = await this.knex('internships').where({ id }).first();
        if (!internship)
            throw new common_1.NotFoundException('Amaliyot topilmadi');
        if (internship.company_id !== requester.companyId)
            throw new common_1.ForbiddenException('Bu amaliyot sizning korxonangizga tegishli emas');
        if (internship.status !== 'pending')
            throw new common_1.ForbiddenException('Bu amaliyot allaqachon ko\'rib chiqilgan');
        await this.knex('internships').where({ id }).update({ status: dto.status, updated_at: this.knex.fn.now() });
        return this.knex('internships').where({ id }).first();
    }
    async addStudent(internshipId, dto, requester) {
        const internship = await this.knex('internships').where({ id: internshipId }).first();
        if (!internship)
            throw new common_1.NotFoundException('Amaliyot topilmadi');
        if (internship.university_id !== requester.universityId)
            throw new common_1.ForbiddenException('Ruxsat yo\'q');
        if (internship.status !== 'accepted')
            throw new common_1.BadRequestException('Faqat tasdiqlangan shartnomaga talaba biriktiriladi');
        const student = await this.knex('students').where({ id: dto.student_id }).first();
        if (!student)
            throw new common_1.NotFoundException('Talaba topilmadi');
        if (student.university_id !== requester.universityId)
            throw new common_1.ForbiddenException('Bu talaba sizning universitetingizga tegishli emas');
        try {
            const [entry] = await this.knex('internship_students')
                .insert({ internship_id: internshipId, student_id: dto.student_id })
                .returning('*');
            return entry;
        }
        catch (err) {
            if (err?.code === '23505')
                throw new common_1.ConflictException('Bu talaba allaqachon biriktirilgan');
            throw err;
        }
    }
    async findStudents(internshipId, requester) {
        const internship = await this.knex('internships').where({ id: internshipId }).first();
        if (!internship)
            throw new common_1.NotFoundException('Amaliyot topilmadi');
        this.assertInternshipAccess(internship, requester);
        return this.knex('internship_students as ist')
            .join('students as s', 'ist.student_id', 's.id')
            .where('ist.internship_id', internshipId)
            .select('ist.*', 's.full_name as student_name', 's.passport_serial', 's.pin')
            .orderBy('ist.created_at', 'asc');
    }
    async findAllStudents(requester) {
        const query = this.knex('internship_students as ist')
            .join('internships as i', 'ist.internship_id', 'i.id')
            .join('students as s', 'ist.student_id', 's.id')
            .join('companies as co', 'i.company_id', 'co.id')
            .leftJoin('university_staff as sup', 'i.supervisor_id', 'sup.id')
            .select('ist.*', 's.full_name as student_name', 'co.name as company_name', 'sup.full_name as supervisor_name', 'i.internship_start', 'i.internship_end')
            .orderBy('ist.created_at', 'desc');
        if (requester.role === role_enum_1.Role.UniversityStaff) {
            query.where('i.university_id', requester.universityId);
        }
        else if (requester.role === role_enum_1.Role.CompanyMentor) {
            query.where('i.company_id', requester.companyId);
        }
        return query;
    }
    async cancelStudent(id, requester) {
        const entry = await this.knex('internship_students as ist')
            .join('internships as i', 'ist.internship_id', 'i.id')
            .where('ist.id', id)
            .select('ist.*', 'i.university_id')
            .first();
        if (!entry)
            throw new common_1.NotFoundException('Talaba yozuvi topilmadi');
        if (entry.university_id !== requester.universityId)
            throw new common_1.ForbiddenException('Ruxsat yo\'q');
        if (entry.status === 'accepted')
            throw new common_1.ForbiddenException('Tasdiqlangan talabani o\'chirib bo\'lmaydi');
        await this.knex('internship_students').where({ id }).update({ status: 'cancelled', updated_at: this.knex.fn.now() });
        return this.knex('internship_students').where({ id }).first();
    }
    async respondStudent(id, dto, requester) {
        const entry = await this.knex('internship_students as ist')
            .join('internships as i', 'ist.internship_id', 'i.id')
            .where('ist.id', id)
            .select('ist.*', 'i.company_id')
            .first();
        if (!entry)
            throw new common_1.NotFoundException('Talaba yozuvi topilmadi');
        if (entry.company_id !== requester.companyId)
            throw new common_1.ForbiddenException('Bu talaba sizning korxonangizga tegishli emas');
        if (entry.status !== 'pending')
            throw new common_1.ForbiddenException('Bu talaba allaqachon ko\'rib chiqilgan');
        await this.knex('internship_students').where({ id }).update({ status: dto.status, updated_at: this.knex.fn.now() });
        return this.knex('internship_students').where({ id }).first();
    }
    assertInternshipAccess(internship, requester) {
        if (requester.role === role_enum_1.Role.SuperAdmin)
            return;
        if (requester.role === role_enum_1.Role.UniversityStaff && internship.university_id !== requester.universityId) {
            throw new common_1.ForbiddenException('Ruxsat yo\'q');
        }
        if (requester.role === role_enum_1.Role.CompanyMentor && internship.company_id !== requester.companyId) {
            throw new common_1.ForbiddenException('Ruxsat yo\'q');
        }
    }
};
exports.InternshipsService = InternshipsService;
exports.InternshipsService = InternshipsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], InternshipsService);
//# sourceMappingURL=internships.service.js.map