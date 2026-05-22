import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../database/database.provider';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { Role } from '../common/enums/role.enum';
import { CreateStudentDto, EnrollStudentDto, UpdateStudentDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async enroll(dto: EnrollStudentDto, requester: JwtPayload) {
    if (
      requester.role === Role.UniversityStaff &&
      dto.university_id !== requester.universityId
    ) {
      throw new ForbiddenException('Cannot enroll student for another university');
    }

    const existing = await this.knex('students').where({ email: dto.email }).first();
    if (existing) throw new ConflictException('Email already in use');

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

  async create(dto: CreateStudentDto, requester: JwtPayload) {
    if (
      requester.role === Role.UniversityStaff &&
      dto.university_id !== requester.universityId
    ) {
      throw new ForbiddenException('Cannot create student for another university');
    }

    const existing = await this.knex('students').where({ email: dto.email }).first();
    if (existing) throw new ConflictException('Email already in use');

    const { password, ...studentData } = dto;
    const password_hash = await bcrypt.hash(password, 10);
    const [student] = await this.knex('students').insert({ ...studentData, password_hash }).returning('*');
    return student;
  }

  async findAll(requester: JwtPayload) {
    const query = this.knex('students as s')
      .leftJoin('universities as uni', 's.university_id', 'uni.id')
      .select('s.*', 'uni.name as university_name');

    if (requester.role === Role.UniversityStaff) {
      query.where('s.university_id', requester.universityId);
    } else if (requester.role === Role.Student) {
      query.where('s.id', requester.sub);
    }

    return query;
  }

  async findOne(id: number, requester: JwtPayload) {
    this.assertAccess(id, requester);

    const student = await this.knex('students as s')
      .leftJoin('universities as uni', 's.university_id', 'uni.id')
      .where('s.id', id)
      .select('s.*', 'uni.name as university_name')
      .first();

    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: number, dto: UpdateStudentDto, requester: JwtPayload) {
    this.assertAccess(id, requester);
    await this.findOne(id, requester);

    const [updated] = await this.knex('students')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');

    return updated;
  }

  private async assertAccess(studentId: number, requester: JwtPayload) {
    if (requester.role === Role.SuperAdmin) return;

    const student = await this.knex('students').where({ id: studentId }).first();
    if (!student) throw new NotFoundException('Student not found');

    if (
      requester.role === Role.UniversityStaff &&
      student.university_id !== requester.universityId
    ) {
      throw new ForbiddenException('Access denied');
    }

    if (
      requester.role === Role.Student &&
      studentId !== requester.sub
    ) {
      throw new ForbiddenException('Access denied');
    }
  }
}
