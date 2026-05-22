import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../database/database.provider';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { Role } from '../common/enums/role.enum';
import {
  CreateDegreeDto,
  CreateDepartmentDto,
  CreateDirectionDto,
  CreateEducationFormDto,
  CreateEducationLanguageDto,
  CreateEducationTypeDto,
  CreateFacultyDto,
  CreateGroupDto,
  CreateCourseDto,
  UpdateDegreeDto,
  UpdateDepartmentDto,
  UpdateDirectionDto,
  UpdateEducationFormDto,
  UpdateEducationLanguageDto,
  UpdateEducationTypeDto,
  UpdateFacultyDto,
  UpdateGroupDto,
  UpdateCourseDto,
} from './dto/academic.dto';

@Injectable()
export class AcademicService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  private universityId(requester: JwtPayload): number | null {
    return requester.role === Role.UniversityStaff ? (requester.universityId ?? null) : null;
  }

  private async assertFacultyAccess(facultyId: number, requester: JwtPayload): Promise<void> {
    const uniId = this.universityId(requester);
    if (!uniId) return;
    const faculty = await this.knex('faculties').where({ id: facultyId }).first();
    if (!faculty) throw new NotFoundException('Faculty not found');
    if (faculty.university_id !== uniId) throw new ForbiddenException();
  }

  private async assertDirectionAccess(directionId: number, requester: JwtPayload): Promise<void> {
    const uniId = this.universityId(requester);
    if (!uniId) return;
    const row = await this.knex('directions as d')
      .join('faculties as f', 'd.faculty_id', 'f.id')
      .where('d.id', directionId)
      .select('f.university_id')
      .first();
    if (!row) throw new NotFoundException('Direction not found');
    if (row.university_id !== uniId) throw new ForbiddenException();
  }

  private async assertCourseAccess(courseId: number, requester: JwtPayload): Promise<void> {
    const uniId = this.universityId(requester);
    if (!uniId) return;
    const row = await this.knex('courses as c')
      .join('directions as d', 'c.direction_id', 'd.id')
      .join('faculties as f', 'd.faculty_id', 'f.id')
      .where('c.id', courseId)
      .select('f.university_id')
      .first();
    if (!row) throw new NotFoundException('Course not found');
    if (row.university_id !== uniId) throw new ForbiddenException();
  }

  private async assertGroupAccess(groupId: number, requester: JwtPayload): Promise<void> {
    const uniId = this.universityId(requester);
    if (!uniId) return;
    const row = await this.knex('groups as g')
      .join('courses as c', 'g.course_id', 'c.id')
      .join('directions as d', 'c.direction_id', 'd.id')
      .join('faculties as f', 'd.faculty_id', 'f.id')
      .where('g.id', groupId)
      .select('f.university_id')
      .first();
    if (!row) throw new NotFoundException('Group not found');
    if (row.university_id !== uniId) throw new ForbiddenException();
  }

  private async resolveUniversityId(requester: JwtPayload): Promise<number> {
    const uniId = this.universityId(requester);
    if (!uniId) throw new ForbiddenException('university_id required');
    return uniId;
  }

  // ── Degrees ────────────────────────────────────────────────────────────────

  async listDegrees(requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    return this.knex('degrees').where({ university_id: uniId }).select('*').orderBy('name');
  }

  async createDegree(dto: CreateDegreeDto, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const [row] = await this.knex('degrees')
      .insert({ university_id: uniId, name: dto.name })
      .returning('*');
    return row;
  }

  async updateDegree(id: number, dto: UpdateDegreeDto, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const row = await this.knex('degrees').where({ id, university_id: uniId }).first();
    if (!row) throw new NotFoundException('Degree not found');
    const [updated] = await this.knex('degrees')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    return updated;
  }

  async deleteDegree(id: number, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const deleted = await this.knex('degrees').where({ id, university_id: uniId }).delete();
    if (!deleted) throw new NotFoundException('Degree not found');
    return { deleted: true };
  }

  // ── Faculties ──────────────────────────────────────────────────────────────

  async listFaculties(requester: JwtPayload) {
    const query = this.knex('faculties').select('*').orderBy('name');
    const uniId = this.universityId(requester);
    if (uniId) query.where({ university_id: uniId });
    return query;
  }

  async createFaculty(dto: CreateFacultyDto, requester: JwtPayload) {
    const university_id = this.universityId(requester) ?? dto.university_id;
    if (!university_id) throw new ForbiddenException('university_id required');
    const [faculty] = await this.knex('faculties')
      .insert({ university_id, name: dto.name, code: dto.code ?? null })
      .returning('*');
    return faculty;
  }

  async updateFaculty(id: number, dto: UpdateFacultyDto, requester: JwtPayload) {
    await this.assertFacultyAccess(id, requester);
    const [updated] = await this.knex('faculties')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    if (!updated) throw new NotFoundException('Faculty not found');
    return updated;
  }

  async deleteFaculty(id: number, requester: JwtPayload) {
    await this.assertFacultyAccess(id, requester);
    const deleted = await this.knex('faculties').where({ id }).delete();
    if (!deleted) throw new NotFoundException('Faculty not found');
    return { deleted: true };
  }

  // ── Departments ────────────────────────────────────────────────────────────

  async listDepartments(facultyId: number, requester: JwtPayload) {
    await this.assertFacultyAccess(facultyId, requester);
    return this.knex('departments').where({ faculty_id: facultyId }).select('*').orderBy('name');
  }

  async listAllDepartments(requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    return this.knex('departments as d')
      .join('faculties as f', 'd.faculty_id', 'f.id')
      .where('f.university_id', uniId)
      .select('d.*', 'f.name as faculty_name')
      .orderBy(['f.name', 'd.name']);
  }

  async createDepartment(dto: CreateDepartmentDto, requester: JwtPayload) {
    await this.assertFacultyAccess(dto.faculty_id, requester);
    const [dept] = await this.knex('departments')
      .insert({ faculty_id: dto.faculty_id, name: dto.name })
      .returning('*');
    return dept;
  }

  async updateDepartment(id: number, dto: UpdateDepartmentDto, requester: JwtPayload) {
    const dept = await this.knex('departments').where({ id }).first();
    if (!dept) throw new NotFoundException('Department not found');
    await this.assertFacultyAccess(dept.faculty_id, requester);
    const [updated] = await this.knex('departments')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    return updated;
  }

  async deleteDepartment(id: number, requester: JwtPayload) {
    const dept = await this.knex('departments').where({ id }).first();
    if (!dept) throw new NotFoundException('Department not found');
    await this.assertFacultyAccess(dept.faculty_id, requester);
    await this.knex('departments').where({ id }).delete();
    return { deleted: true };
  }

  // ── Education Forms ────────────────────────────────────────────────────────

  async listEducationForms(requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    return this.knex('education_forms').where({ university_id: uniId }).select('*').orderBy('name');
  }

  async createEducationForm(dto: CreateEducationFormDto, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const [row] = await this.knex('education_forms')
      .insert({ university_id: uniId, name: dto.name })
      .returning('*');
    return row;
  }

  async updateEducationForm(id: number, dto: UpdateEducationFormDto, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const row = await this.knex('education_forms').where({ id, university_id: uniId }).first();
    if (!row) throw new NotFoundException('Education form not found');
    const [updated] = await this.knex('education_forms')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    return updated;
  }

  async deleteEducationForm(id: number, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const deleted = await this.knex('education_forms').where({ id, university_id: uniId }).delete();
    if (!deleted) throw new NotFoundException('Education form not found');
    return { deleted: true };
  }

  // ── Education Types ────────────────────────────────────────────────────────

  async listEducationTypes(requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    return this.knex('education_types').where({ university_id: uniId }).select('*').orderBy('name');
  }

  async createEducationType(dto: CreateEducationTypeDto, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const [row] = await this.knex('education_types')
      .insert({ university_id: uniId, name: dto.name })
      .returning('*');
    return row;
  }

  async updateEducationType(id: number, dto: UpdateEducationTypeDto, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const row = await this.knex('education_types').where({ id, university_id: uniId }).first();
    if (!row) throw new NotFoundException('Education type not found');
    const [updated] = await this.knex('education_types')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    return updated;
  }

  async deleteEducationType(id: number, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const deleted = await this.knex('education_types').where({ id, university_id: uniId }).delete();
    if (!deleted) throw new NotFoundException('Education type not found');
    return { deleted: true };
  }

  // ── Education Languages ────────────────────────────────────────────────────

  async listEducationLanguages(requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    return this.knex('education_languages').where({ university_id: uniId }).select('*').orderBy('name');
  }

  async createEducationLanguage(dto: CreateEducationLanguageDto, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const [row] = await this.knex('education_languages')
      .insert({ university_id: uniId, name: dto.name })
      .returning('*');
    return row;
  }

  async updateEducationLanguage(id: number, dto: UpdateEducationLanguageDto, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const row = await this.knex('education_languages').where({ id, university_id: uniId }).first();
    if (!row) throw new NotFoundException('Education language not found');
    const [updated] = await this.knex('education_languages')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    return updated;
  }

  async deleteEducationLanguage(id: number, requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    const deleted = await this.knex('education_languages').where({ id, university_id: uniId }).delete();
    if (!deleted) throw new NotFoundException('Education language not found');
    return { deleted: true };
  }

  // ── Directions ─────────────────────────────────────────────────────────────

  async listDirections(facultyId: number, requester: JwtPayload) {
    await this.assertFacultyAccess(facultyId, requester);
    return this.knex('directions as d')
      .where('d.faculty_id', facultyId)
      .leftJoin('education_forms as ef', 'd.edu_form_id', 'ef.id')
      .leftJoin('education_types as et', 'd.edu_type_id', 'et.id')
      .leftJoin('education_languages as el', 'd.edu_lang_id', 'el.id')
      .leftJoin('degrees as dg', 'd.degree_id', 'dg.id')
      .select(
        'd.*',
        'ef.name as edu_form_name',
        'et.name as edu_type_name',
        'el.name as edu_lang_name',
        'dg.name as degree_name',
      )
      .orderBy('d.name');
  }

  async listAllDirections(requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    return this.knex('directions as d')
      .join('faculties as f', 'd.faculty_id', 'f.id')
      .where('f.university_id', uniId)
      .leftJoin('education_forms as ef', 'd.edu_form_id', 'ef.id')
      .leftJoin('education_types as et', 'd.edu_type_id', 'et.id')
      .leftJoin('education_languages as el', 'd.edu_lang_id', 'el.id')
      .leftJoin('degrees as dg', 'd.degree_id', 'dg.id')
      .select(
        'd.*',
        'f.name as faculty_name',
        'ef.name as edu_form_name',
        'et.name as edu_type_name',
        'el.name as edu_lang_name',
        'dg.name as degree_name',
      )
      .orderBy(['f.name', 'd.name']);
  }

  async createDirection(dto: CreateDirectionDto, requester: JwtPayload) {
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

  async updateDirection(id: number, dto: UpdateDirectionDto, requester: JwtPayload) {
    await this.assertDirectionAccess(id, requester);
    const [updated] = await this.knex('directions')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    if (!updated) throw new NotFoundException('Direction not found');
    return updated;
  }

  async deleteDirection(id: number, requester: JwtPayload) {
    await this.assertDirectionAccess(id, requester);
    const deleted = await this.knex('directions').where({ id }).delete();
    if (!deleted) throw new NotFoundException('Direction not found');
    return { deleted: true };
  }

  // ── Courses ────────────────────────────────────────────────────────────────

  async listCourses(directionId: number, requester: JwtPayload) {
    await this.assertDirectionAccess(directionId, requester);
    return this.knex('courses')
      .where({ direction_id: directionId })
      .select('*')
      .orderBy('number');
  }

  async listAllCourses(requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    return this.knex('courses as c')
      .join('directions as d', 'c.direction_id', 'd.id')
      .join('faculties as f', 'd.faculty_id', 'f.id')
      .where('f.university_id', uniId)
      .select('c.*', 'd.name as direction_name', 'f.name as faculty_name')
      .orderBy(['d.name', 'c.number']);
  }

  async createCourse(dto: CreateCourseDto, requester: JwtPayload) {
    await this.assertDirectionAccess(dto.direction_id, requester);
    const [course] = await this.knex('courses')
      .insert({ direction_id: dto.direction_id, number: dto.number })
      .returning('*');
    return course;
  }

  async updateCourse(id: number, dto: UpdateCourseDto, requester: JwtPayload) {
    await this.assertCourseAccess(id, requester);
    const [updated] = await this.knex('courses')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    if (!updated) throw new NotFoundException('Course not found');
    return updated;
  }

  async deleteCourse(id: number, requester: JwtPayload) {
    await this.assertCourseAccess(id, requester);
    const deleted = await this.knex('courses').where({ id }).delete();
    if (!deleted) throw new NotFoundException('Course not found');
    return { deleted: true };
  }

  // ── Groups ─────────────────────────────────────────────────────────────────

  async listGroups(courseId: number, requester: JwtPayload) {
    await this.assertCourseAccess(courseId, requester);
    return this.knex('groups').where({ course_id: courseId }).select('*').orderBy('name');
  }

  async listAllGroups(requester: JwtPayload) {
    const uniId = await this.resolveUniversityId(requester);
    return this.knex('groups as g')
      .join('courses as c', 'g.course_id', 'c.id')
      .join('directions as d', 'c.direction_id', 'd.id')
      .join('faculties as f', 'd.faculty_id', 'f.id')
      .where('f.university_id', uniId)
      .select(
        'g.*',
        'c.number as course_number',
        'c.direction_id',
        'd.name as direction_name',
        'd.faculty_id',
        'd.edu_form_id',
        'd.edu_type_id',
        'd.edu_lang_id',
      )
      .orderBy(['d.name', 'c.number', 'g.name']);
  }

  async createGroup(dto: CreateGroupDto, requester: JwtPayload) {
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

  async updateGroup(id: number, dto: UpdateGroupDto, requester: JwtPayload) {
    await this.assertGroupAccess(id, requester);
    const [updated] = await this.knex('groups')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    if (!updated) throw new NotFoundException('Group not found');
    return updated;
  }

  async deleteGroup(id: number, requester: JwtPayload) {
    await this.assertGroupAccess(id, requester);
    const deleted = await this.knex('groups').where({ id }).delete();
    if (!deleted) throw new NotFoundException('Group not found');
    return { deleted: true };
  }
}
