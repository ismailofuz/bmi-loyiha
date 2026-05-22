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
exports.AcademicService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const database_provider_1 = require("../database/database.provider");
const role_enum_1 = require("../common/enums/role.enum");
let AcademicService = class AcademicService {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    universityId(requester) {
        return requester.role === role_enum_1.Role.UniversityStaff ? (requester.universityId ?? null) : null;
    }
    async assertFacultyAccess(facultyId, requester) {
        const uniId = this.universityId(requester);
        if (!uniId)
            return;
        const faculty = await this.knex('faculties').where({ id: facultyId }).first();
        if (!faculty)
            throw new common_1.NotFoundException('Faculty not found');
        if (faculty.university_id !== uniId)
            throw new common_1.ForbiddenException();
    }
    async assertDirectionAccess(directionId, requester) {
        const uniId = this.universityId(requester);
        if (!uniId)
            return;
        const row = await this.knex('directions as d')
            .join('faculties as f', 'd.faculty_id', 'f.id')
            .where('d.id', directionId)
            .select('f.university_id')
            .first();
        if (!row)
            throw new common_1.NotFoundException('Direction not found');
        if (row.university_id !== uniId)
            throw new common_1.ForbiddenException();
    }
    async assertCourseAccess(courseId, requester) {
        const uniId = this.universityId(requester);
        if (!uniId)
            return;
        const row = await this.knex('courses as c')
            .join('directions as d', 'c.direction_id', 'd.id')
            .join('faculties as f', 'd.faculty_id', 'f.id')
            .where('c.id', courseId)
            .select('f.university_id')
            .first();
        if (!row)
            throw new common_1.NotFoundException('Course not found');
        if (row.university_id !== uniId)
            throw new common_1.ForbiddenException();
    }
    async assertGroupAccess(groupId, requester) {
        const uniId = this.universityId(requester);
        if (!uniId)
            return;
        const row = await this.knex('groups as g')
            .join('courses as c', 'g.course_id', 'c.id')
            .join('directions as d', 'c.direction_id', 'd.id')
            .join('faculties as f', 'd.faculty_id', 'f.id')
            .where('g.id', groupId)
            .select('f.university_id')
            .first();
        if (!row)
            throw new common_1.NotFoundException('Group not found');
        if (row.university_id !== uniId)
            throw new common_1.ForbiddenException();
    }
    async resolveUniversityId(requester) {
        const uniId = this.universityId(requester);
        if (!uniId)
            throw new common_1.ForbiddenException('university_id required');
        return uniId;
    }
    async listDegrees(requester) {
        const uniId = await this.resolveUniversityId(requester);
        return this.knex('degrees').where({ university_id: uniId }).select('*').orderBy('name');
    }
    async createDegree(dto, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const [row] = await this.knex('degrees')
            .insert({ university_id: uniId, name: dto.name })
            .returning('*');
        return row;
    }
    async updateDegree(id, dto, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const row = await this.knex('degrees').where({ id, university_id: uniId }).first();
        if (!row)
            throw new common_1.NotFoundException('Degree not found');
        const [updated] = await this.knex('degrees')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        return updated;
    }
    async deleteDegree(id, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const deleted = await this.knex('degrees').where({ id, university_id: uniId }).delete();
        if (!deleted)
            throw new common_1.NotFoundException('Degree not found');
        return { deleted: true };
    }
    async listFaculties(requester) {
        const query = this.knex('faculties').select('*').orderBy('name');
        const uniId = this.universityId(requester);
        if (uniId)
            query.where({ university_id: uniId });
        return query;
    }
    async createFaculty(dto, requester) {
        const university_id = this.universityId(requester) ?? dto.university_id;
        if (!university_id)
            throw new common_1.ForbiddenException('university_id required');
        const [faculty] = await this.knex('faculties')
            .insert({ university_id, name: dto.name, code: dto.code ?? null })
            .returning('*');
        return faculty;
    }
    async updateFaculty(id, dto, requester) {
        await this.assertFacultyAccess(id, requester);
        const [updated] = await this.knex('faculties')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        if (!updated)
            throw new common_1.NotFoundException('Faculty not found');
        return updated;
    }
    async deleteFaculty(id, requester) {
        await this.assertFacultyAccess(id, requester);
        const deleted = await this.knex('faculties').where({ id }).delete();
        if (!deleted)
            throw new common_1.NotFoundException('Faculty not found');
        return { deleted: true };
    }
    async listDepartments(facultyId, requester) {
        await this.assertFacultyAccess(facultyId, requester);
        return this.knex('departments').where({ faculty_id: facultyId }).select('*').orderBy('name');
    }
    async listAllDepartments(requester) {
        const uniId = await this.resolveUniversityId(requester);
        return this.knex('departments as d')
            .join('faculties as f', 'd.faculty_id', 'f.id')
            .where('f.university_id', uniId)
            .select('d.*', 'f.name as faculty_name')
            .orderBy(['f.name', 'd.name']);
    }
    async createDepartment(dto, requester) {
        await this.assertFacultyAccess(dto.faculty_id, requester);
        const [dept] = await this.knex('departments')
            .insert({ faculty_id: dto.faculty_id, name: dto.name })
            .returning('*');
        return dept;
    }
    async updateDepartment(id, dto, requester) {
        const dept = await this.knex('departments').where({ id }).first();
        if (!dept)
            throw new common_1.NotFoundException('Department not found');
        await this.assertFacultyAccess(dept.faculty_id, requester);
        const [updated] = await this.knex('departments')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        return updated;
    }
    async deleteDepartment(id, requester) {
        const dept = await this.knex('departments').where({ id }).first();
        if (!dept)
            throw new common_1.NotFoundException('Department not found');
        await this.assertFacultyAccess(dept.faculty_id, requester);
        await this.knex('departments').where({ id }).delete();
        return { deleted: true };
    }
    async listEducationForms(requester) {
        const uniId = await this.resolveUniversityId(requester);
        return this.knex('education_forms').where({ university_id: uniId }).select('*').orderBy('name');
    }
    async createEducationForm(dto, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const [row] = await this.knex('education_forms')
            .insert({ university_id: uniId, name: dto.name })
            .returning('*');
        return row;
    }
    async updateEducationForm(id, dto, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const row = await this.knex('education_forms').where({ id, university_id: uniId }).first();
        if (!row)
            throw new common_1.NotFoundException('Education form not found');
        const [updated] = await this.knex('education_forms')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        return updated;
    }
    async deleteEducationForm(id, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const deleted = await this.knex('education_forms').where({ id, university_id: uniId }).delete();
        if (!deleted)
            throw new common_1.NotFoundException('Education form not found');
        return { deleted: true };
    }
    async listEducationTypes(requester) {
        const uniId = await this.resolveUniversityId(requester);
        return this.knex('education_types').where({ university_id: uniId }).select('*').orderBy('name');
    }
    async createEducationType(dto, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const [row] = await this.knex('education_types')
            .insert({ university_id: uniId, name: dto.name })
            .returning('*');
        return row;
    }
    async updateEducationType(id, dto, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const row = await this.knex('education_types').where({ id, university_id: uniId }).first();
        if (!row)
            throw new common_1.NotFoundException('Education type not found');
        const [updated] = await this.knex('education_types')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        return updated;
    }
    async deleteEducationType(id, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const deleted = await this.knex('education_types').where({ id, university_id: uniId }).delete();
        if (!deleted)
            throw new common_1.NotFoundException('Education type not found');
        return { deleted: true };
    }
    async listEducationLanguages(requester) {
        const uniId = await this.resolveUniversityId(requester);
        return this.knex('education_languages').where({ university_id: uniId }).select('*').orderBy('name');
    }
    async createEducationLanguage(dto, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const [row] = await this.knex('education_languages')
            .insert({ university_id: uniId, name: dto.name })
            .returning('*');
        return row;
    }
    async updateEducationLanguage(id, dto, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const row = await this.knex('education_languages').where({ id, university_id: uniId }).first();
        if (!row)
            throw new common_1.NotFoundException('Education language not found');
        const [updated] = await this.knex('education_languages')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        return updated;
    }
    async deleteEducationLanguage(id, requester) {
        const uniId = await this.resolveUniversityId(requester);
        const deleted = await this.knex('education_languages').where({ id, university_id: uniId }).delete();
        if (!deleted)
            throw new common_1.NotFoundException('Education language not found');
        return { deleted: true };
    }
    async listDirections(facultyId, requester) {
        await this.assertFacultyAccess(facultyId, requester);
        return this.knex('directions as d')
            .where('d.faculty_id', facultyId)
            .leftJoin('education_forms as ef', 'd.edu_form_id', 'ef.id')
            .leftJoin('education_types as et', 'd.edu_type_id', 'et.id')
            .leftJoin('education_languages as el', 'd.edu_lang_id', 'el.id')
            .leftJoin('degrees as dg', 'd.degree_id', 'dg.id')
            .select('d.*', 'ef.name as edu_form_name', 'et.name as edu_type_name', 'el.name as edu_lang_name', 'dg.name as degree_name')
            .orderBy('d.name');
    }
    async listAllDirections(requester) {
        const uniId = await this.resolveUniversityId(requester);
        return this.knex('directions as d')
            .join('faculties as f', 'd.faculty_id', 'f.id')
            .where('f.university_id', uniId)
            .leftJoin('education_forms as ef', 'd.edu_form_id', 'ef.id')
            .leftJoin('education_types as et', 'd.edu_type_id', 'et.id')
            .leftJoin('education_languages as el', 'd.edu_lang_id', 'el.id')
            .leftJoin('degrees as dg', 'd.degree_id', 'dg.id')
            .select('d.*', 'f.name as faculty_name', 'ef.name as edu_form_name', 'et.name as edu_type_name', 'el.name as edu_lang_name', 'dg.name as degree_name')
            .orderBy(['f.name', 'd.name']);
    }
    async createDirection(dto, requester) {
        await this.assertFacultyAccess(dto.faculty_id, requester);
        const [dir] = await this.knex('directions')
            .insert({
            faculty_id: dto.faculty_id,
            name: dto.name,
            code: dto.code ?? null,
            edu_form_id: dto.edu_form_id ?? null,
            edu_type_id: dto.edu_type_id ?? null,
            edu_lang_id: dto.edu_lang_id ?? null,
            degree_id: dto.degree_id ?? null,
        })
            .returning('*');
        return dir;
    }
    async updateDirection(id, dto, requester) {
        await this.assertDirectionAccess(id, requester);
        const [updated] = await this.knex('directions')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        if (!updated)
            throw new common_1.NotFoundException('Direction not found');
        return updated;
    }
    async deleteDirection(id, requester) {
        await this.assertDirectionAccess(id, requester);
        const deleted = await this.knex('directions').where({ id }).delete();
        if (!deleted)
            throw new common_1.NotFoundException('Direction not found');
        return { deleted: true };
    }
    async listCourses(directionId, requester) {
        await this.assertDirectionAccess(directionId, requester);
        return this.knex('courses')
            .where({ direction_id: directionId })
            .select('*')
            .orderBy('number');
    }
    async listAllCourses(requester) {
        const uniId = await this.resolveUniversityId(requester);
        return this.knex('courses as c')
            .join('directions as d', 'c.direction_id', 'd.id')
            .join('faculties as f', 'd.faculty_id', 'f.id')
            .where('f.university_id', uniId)
            .select('c.*', 'd.name as direction_name', 'f.name as faculty_name')
            .orderBy(['d.name', 'c.number']);
    }
    async createCourse(dto, requester) {
        await this.assertDirectionAccess(dto.direction_id, requester);
        const [course] = await this.knex('courses')
            .insert({ direction_id: dto.direction_id, number: dto.number })
            .returning('*');
        return course;
    }
    async updateCourse(id, dto, requester) {
        await this.assertCourseAccess(id, requester);
        const [updated] = await this.knex('courses')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        if (!updated)
            throw new common_1.NotFoundException('Course not found');
        return updated;
    }
    async deleteCourse(id, requester) {
        await this.assertCourseAccess(id, requester);
        const deleted = await this.knex('courses').where({ id }).delete();
        if (!deleted)
            throw new common_1.NotFoundException('Course not found');
        return { deleted: true };
    }
    async listGroups(courseId, requester) {
        await this.assertCourseAccess(courseId, requester);
        return this.knex('groups').where({ course_id: courseId }).select('*').orderBy('name');
    }
    async listAllGroups(requester) {
        const uniId = await this.resolveUniversityId(requester);
        return this.knex('groups as g')
            .join('courses as c', 'g.course_id', 'c.id')
            .join('directions as d', 'c.direction_id', 'd.id')
            .join('faculties as f', 'd.faculty_id', 'f.id')
            .where('f.university_id', uniId)
            .select('g.*', 'c.number as course_number', 'c.direction_id', 'd.name as direction_name', 'd.faculty_id', 'd.edu_form_id', 'd.edu_type_id', 'd.edu_lang_id')
            .orderBy(['d.name', 'c.number', 'g.name']);
    }
    async createGroup(dto, requester) {
        await this.assertCourseAccess(dto.course_id, requester);
        const row = await this.knex('courses as c')
            .join('directions as d', 'c.direction_id', 'd.id')
            .join('faculties as f', 'd.faculty_id', 'f.id')
            .where('c.id', dto.course_id)
            .select('f.university_id')
            .first();
        const [group] = await this.knex('groups')
            .insert({ course_id: dto.course_id, name: dto.name, university_id: row.university_id })
            .returning('*');
        return group;
    }
    async updateGroup(id, dto, requester) {
        await this.assertGroupAccess(id, requester);
        const [updated] = await this.knex('groups')
            .where({ id })
            .update({ ...dto, updated_at: this.knex.fn.now() })
            .returning('*');
        if (!updated)
            throw new common_1.NotFoundException('Group not found');
        return updated;
    }
    async deleteGroup(id, requester) {
        await this.assertGroupAccess(id, requester);
        const deleted = await this.knex('groups').where({ id }).delete();
        if (!deleted)
            throw new common_1.NotFoundException('Group not found');
        return { deleted: true };
    }
};
exports.AcademicService = AcademicService;
exports.AcademicService = AcademicService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], AcademicService);
//# sourceMappingURL=academic.service.js.map