import {
  BadRequestException,
  ConflictException,
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
  AddStudentDto,
  CreateInternshipDto,
  RespondInternshipDto,
  RespondStudentDto,
  UpdateInternshipDto,
} from './dto/internship.dto';

@Injectable()
export class InternshipsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  // ── Shartnomalar ────────────────────────────────────────────────

  async create(dto: CreateInternshipDto, requester: JwtPayload) {
    const [internship] = await this.knex('internships')
      .insert({
        company_id:       dto.company_id,
        university_id:    requester.universityId,
        supervisor_id:    dto.supervisor_id ?? null,
        internship_start: dto.internship_start,
        internship_end:   dto.internship_end,
      })
      .returning('*');
    return internship;
  }

  async findAll(requester: JwtPayload) {
    const query = this.knex('internships as i')
      .join('companies as co', 'i.company_id', 'co.id')
      .leftJoin('university_staff as sup', 'i.supervisor_id', 'sup.id')
      .select(
        'i.*',
        'co.name as company_name',
        'sup.full_name as supervisor_name',
      )
      .orderBy('i.created_at', 'desc');

    if (requester.role === Role.UniversityStaff) {
      query.where('i.university_id', requester.universityId);
    } else if (requester.role === Role.CompanyMentor) {
      query.where('i.company_id', requester.companyId);
    }

    return query;
  }

  async findOne(id: number, requester: JwtPayload) {
    const internship = await this.knex('internships as i')
      .join('companies as co', 'i.company_id', 'co.id')
      .leftJoin('university_staff as sup', 'i.supervisor_id', 'sup.id')
      .where('i.id', id)
      .select('i.*', 'co.name as company_name', 'sup.full_name as supervisor_name')
      .first();

    if (!internship) throw new NotFoundException('Amaliyot topilmadi');
    this.assertInternshipAccess(internship, requester);
    return internship;
  }

  async update(id: number, dto: UpdateInternshipDto, requester: JwtPayload) {
    const internship = await this.knex('internships').where({ id }).first();
    if (!internship) throw new NotFoundException('Amaliyot topilmadi');
    if (internship.university_id !== requester.universityId) throw new ForbiddenException('Ruxsat yo\'q');

    const [updated] = await this.knex('internships')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    return updated;
  }

  async cancel(id: number, requester: JwtPayload) {
    const internship = await this.knex('internships').where({ id }).first();
    if (!internship) throw new NotFoundException('Amaliyot topilmadi');
    if (internship.university_id !== requester.universityId) throw new ForbiddenException('Ruxsat yo\'q');
    if (internship.status === 'accepted') throw new ForbiddenException('Tasdiqlangan shartnomani bekor qilib bo\'lmaydi');

    await this.knex('internships').where({ id }).update({ status: 'cancelled', updated_at: this.knex.fn.now() });
    return this.knex('internships').where({ id }).first();
  }

  async respond(id: number, dto: RespondInternshipDto, requester: JwtPayload) {
    const internship = await this.knex('internships').where({ id }).first();
    if (!internship) throw new NotFoundException('Amaliyot topilmadi');
    if (internship.company_id !== requester.companyId) throw new ForbiddenException('Bu amaliyot sizning korxonangizga tegishli emas');
    if (internship.status !== 'pending') throw new ForbiddenException('Bu amaliyot allaqachon ko\'rib chiqilgan');

    await this.knex('internships').where({ id }).update({ status: dto.status, updated_at: this.knex.fn.now() });
    return this.knex('internships').where({ id }).first();
  }

  // ── Talaba biriktirishlari ──────────────────────────────────────

  async addStudent(internshipId: number, dto: AddStudentDto, requester: JwtPayload) {
    const internship = await this.knex('internships').where({ id: internshipId }).first();
    if (!internship) throw new NotFoundException('Amaliyot topilmadi');
    if (internship.university_id !== requester.universityId) throw new ForbiddenException('Ruxsat yo\'q');
    if (internship.status !== 'accepted') throw new BadRequestException('Faqat tasdiqlangan shartnomaga talaba biriktiriladi');

    const student = await this.knex('students').where({ id: dto.student_id }).first();
    if (!student) throw new NotFoundException('Talaba topilmadi');
    if (student.university_id !== requester.universityId) throw new ForbiddenException('Bu talaba sizning universitetingizga tegishli emas');

    try {
      const [entry] = await this.knex('internship_students')
        .insert({ internship_id: internshipId, student_id: dto.student_id })
        .returning('*');
      return entry;
    } catch (err: any) {
      if (err?.code === '23505') throw new ConflictException('Bu talaba allaqachon biriktirilgan');
      throw err;
    }
  }

  async findStudents(internshipId: number, requester: JwtPayload) {
    const internship = await this.knex('internships').where({ id: internshipId }).first();
    if (!internship) throw new NotFoundException('Amaliyot topilmadi');
    this.assertInternshipAccess(internship, requester);

    return this.knex('internship_students as ist')
      .join('students as s', 'ist.student_id', 's.id')
      .where('ist.internship_id', internshipId)
      .select('ist.*', 's.full_name as student_name', 's.passport_serial', 's.pin')
      .orderBy('ist.created_at', 'asc');
  }

  async findAllStudents(requester: JwtPayload) {
    const query = this.knex('internship_students as ist')
      .join('internships as i', 'ist.internship_id', 'i.id')
      .join('students as s', 'ist.student_id', 's.id')
      .join('companies as co', 'i.company_id', 'co.id')
      .leftJoin('university_staff as sup', 'i.supervisor_id', 'sup.id')
      .select(
        'ist.*',
        's.full_name as student_name',
        'co.name as company_name',
        'sup.full_name as supervisor_name',
        'i.internship_start',
        'i.internship_end',
      )
      .orderBy('ist.created_at', 'desc');

    if (requester.role === Role.UniversityStaff) {
      query.where('i.university_id', requester.universityId);
    } else if (requester.role === Role.CompanyMentor) {
      query.where('i.company_id', requester.companyId);
    }

    return query;
  }

  async cancelStudent(id: number, requester: JwtPayload) {
    const entry = await this.knex('internship_students as ist')
      .join('internships as i', 'ist.internship_id', 'i.id')
      .where('ist.id', id)
      .select('ist.*', 'i.university_id')
      .first();

    if (!entry) throw new NotFoundException('Talaba yozuvi topilmadi');
    if (entry.university_id !== requester.universityId) throw new ForbiddenException('Ruxsat yo\'q');
    if (entry.status === 'accepted') throw new ForbiddenException('Tasdiqlangan talabani o\'chirib bo\'lmaydi');

    await this.knex('internship_students').where({ id }).update({ status: 'cancelled', updated_at: this.knex.fn.now() });
    return this.knex('internship_students').where({ id }).first();
  }

  async respondStudent(id: number, dto: RespondStudentDto, requester: JwtPayload) {
    const entry = await this.knex('internship_students as ist')
      .join('internships as i', 'ist.internship_id', 'i.id')
      .where('ist.id', id)
      .select('ist.*', 'i.company_id')
      .first();

    if (!entry) throw new NotFoundException('Talaba yozuvi topilmadi');
    if (entry.company_id !== requester.companyId) throw new ForbiddenException('Bu talaba sizning korxonangizga tegishli emas');
    if (entry.status !== 'pending') throw new ForbiddenException('Bu talaba allaqachon ko\'rib chiqilgan');

    await this.knex('internship_students').where({ id }).update({ status: dto.status, updated_at: this.knex.fn.now() });
    return this.knex('internship_students').where({ id }).first();
  }

  // ── Helpers ────────────────────────────────────────────────────

  private assertInternshipAccess(internship: any, requester: JwtPayload) {
    if (requester.role === Role.SuperAdmin) return;
    if (requester.role === Role.UniversityStaff && internship.university_id !== requester.universityId) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }
    if (requester.role === Role.CompanyMentor && internship.company_id !== requester.companyId) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }
  }
}
