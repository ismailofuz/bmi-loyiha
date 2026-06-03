import {
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
import { CheckInDto, CreateAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AttendanceService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  /** Talaba o'zi amaliyot joyiga kelganini tasdiqlaydi (check-in) */
  async checkIn(dto: CheckInDto, requester: JwtPayload) {
    const date = dto.date ?? new Date().toISOString().slice(0, 10);

    // Talabaning qabul qilingan (accepted) faol biriktiruvini topish
    const assignment = await this.knex('internship_students as ist')
      .join('internships as i', 'ist.internship_id', 'i.id')
      .where('ist.student_id', requester.sub)
      .andWhere('ist.status', 'accepted')
      .orderBy('ist.created_at', 'desc')
      .select('ist.id', 'i.internship_start', 'i.internship_end')
      .first();

    if (!assignment) {
      throw new BadRequestException('Tasdiqlangan amaliyot biriktiruvi topilmadi');
    }

    const note = dto.location ? `Lokatsiya: ${dto.location}` : 'Talaba check-in qildi';

    const existing = await this.knex('student_attendance')
      .where({ internship_student_id: assignment.id, date })
      .first();

    if (existing) {
      const [updated] = await this.knex('student_attendance')
        .where({ id: existing.id })
        .update({ is_present: true, note, updated_at: this.knex.fn.now() })
        .returning('*');
      return updated;
    }

    const [record] = await this.knex('student_attendance')
      .insert({ internship_student_id: assignment.id, date, is_present: true, note })
      .returning('*');
    return record;
  }

  async create(dto: CreateAttendanceDto, requester: JwtPayload) {
    await this.assertWriteAccess(dto.internship_student_id, requester);

    try {
      const [record] = await this.knex('student_attendance')
        .insert({
          internship_student_id: dto.internship_student_id,
          date: dto.date,
          is_present: dto.is_present ?? true,
          grade: dto.grade ?? null,
          note: dto.note ?? null,
        })
        .returning('*');
      return record;
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException('Bu sana uchun davomat allaqachon belgilangan');
      }
      throw err;
    }
  }

  async findByInternshipStudent(internshipStudentId: number, requester: JwtPayload) {
    await this.assertReadAccess(internshipStudentId, requester);
    return this.knex('student_attendance')
      .where({ internship_student_id: internshipStudentId })
      .orderBy('date', 'asc');
  }

  async findByInternship(internshipId: number, requester: JwtPayload) {
    const internship = await this.knex('internships').where({ id: internshipId }).first();
    if (!internship) throw new NotFoundException('Amaliyot topilmadi');

    if (requester.role === Role.UniversityStaff && internship.university_id !== requester.universityId) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }
    if (requester.role === Role.CompanyMentor && internship.company_id !== requester.companyId) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }

    return this.knex('student_attendance as sa')
      .join('internship_students as ist', 'sa.internship_student_id', 'ist.id')
      .join('students as s', 'ist.student_id', 's.id')
      .where('ist.internship_id', internshipId)
      .select('sa.*', 's.full_name as student_name', 'ist.student_id')
      .orderBy('sa.date', 'asc');
  }

  async update(id: number, dto: UpdateAttendanceDto, requester: JwtPayload) {
    const record = await this.knex('student_attendance').where({ id }).first();
    if (!record) throw new NotFoundException('Davomat yozuvi topilmadi');

    await this.assertWriteAccess(record.internship_student_id, requester);

    const [updated] = await this.knex('student_attendance')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    return updated;
  }

  private async assertWriteAccess(internshipStudentId: number, requester: JwtPayload) {
    if (requester.role === Role.SuperAdmin) return;

    const entry = await this.knex('internship_students as ist')
      .join('internships as i', 'ist.internship_id', 'i.id')
      .where('ist.id', internshipStudentId)
      .select('i.university_id', 'i.company_id')
      .first();

    if (!entry) throw new NotFoundException('Talaba amaliyoti topilmadi');

    if (requester.role === Role.UniversityStaff && entry.university_id !== requester.universityId) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }
    if (requester.role === Role.CompanyMentor && entry.company_id !== requester.companyId) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }
  }

  private async assertReadAccess(internshipStudentId: number, requester: JwtPayload) {
    if (requester.role === Role.SuperAdmin) return;

    const entry = await this.knex('internship_students as ist')
      .join('internships as i', 'ist.internship_id', 'i.id')
      .where('ist.id', internshipStudentId)
      .select('i.university_id', 'i.company_id', 'ist.student_id')
      .first();

    if (!entry) throw new NotFoundException('Talaba amaliyoti topilmadi');

    if (requester.role === Role.Student && entry.student_id !== requester.sub) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }
    if (requester.role === Role.UniversityStaff && entry.university_id !== requester.universityId) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }
    if (requester.role === Role.CompanyMentor && entry.company_id !== requester.companyId) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }
  }
}
