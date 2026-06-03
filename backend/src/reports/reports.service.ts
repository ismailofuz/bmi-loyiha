import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../database/database.provider';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { Role } from '../common/enums/role.enum';
import { CreateReportDto, ReviewReportDto, UpdateReportDto } from './dto/report.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly notifications: NotificationsService,
  ) {}

  async create(
    dto: CreateReportDto,
    requester: JwtPayload,
    file?: { url: string; name: string; mime: string },
  ) {
    const status = dto.status ?? 'submitted';
    const { status: _ignored, ...rest } = dto;

    const fileFields = file
      ? { file_url: file.url, file_name: file.name, file_mime: file.mime }
      : {};

    // Kunlik hisobot — har sana uchun bitta. Shu sanaga hisobot bo'lsa
    // yangilaymiz (unique "nom" xatosi chiqmaydi), bo'lmasa yaratamiz.
    const existing = await this.knex('reports')
      .where({ student_id: requester.sub, report_date: rest.report_date })
      .first();

    let report;
    if (existing) {
      if (existing.status === 'approved') {
        throw new BadRequestException('Tasdiqlangan hisobotni o\'zgartirib bo\'lmaydi');
      }
      [report] = await this.knex('reports')
        .where({ id: existing.id })
        .update({ ...rest, status, ...fileFields, updated_at: this.knex.fn.now() })
        .returning('*');
    } else {
      [report] = await this.knex('reports')
        .insert({ ...rest, student_id: requester.sub, status, ...fileFields })
        .returning('*');
    }

    if (status === 'submitted') await this.notifyMentorOfSubmission(report);
    return report;
  }

  async findAll(studentId: number, requester: JwtPayload) {
    await this.assertReadAccess(studentId, requester);
    return this.knex('reports')
      .where({ student_id: studentId })
      .orderBy('report_date', 'desc');
  }

  async findOne(id: number, requester: JwtPayload) {
    const report = await this.knex('reports').where({ id }).first();
    if (!report) throw new NotFoundException('Report not found');
    await this.assertReadAccess(report.student_id, requester);
    return report;
  }

  async update(id: number, dto: UpdateReportDto, requester: JwtPayload) {
    const report = await this.knex('reports').where({ id }).first();
    if (!report) throw new NotFoundException('Report not found');

    if (report.student_id !== requester.sub) {
      throw new ForbiddenException('Cannot edit another student\'s report');
    }
    if (report.status === 'approved') {
      throw new BadRequestException('Cannot edit an approved report');
    }

    const wasRejectedOrDraft = report.status === 'rejected' || report.status === 'draft';
    const resubmitting = dto.status === 'submitted' && wasRejectedOrDraft;

    const [updated] = await this.knex('reports')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');

    // Rad etilgan hisobot qayta yuborilganda mentorga xabar
    if (resubmitting) await this.notifyMentorOfSubmission(updated);

    return updated;
  }

  async review(id: number, dto: ReviewReportDto, requester: JwtPayload) {
    const report = await this.knex('reports').where({ id }).first();
    if (!report) throw new NotFoundException('Report not found');

    // submitted -> baholash; approved -> mentor bahoni tahrirlashi mumkin
    if (report.status !== 'submitted' && report.status !== 'approved') {
      throw new BadRequestException(
        'Faqat yuborilgan yoki tasdiqlangan hisobotni ko\'rib chiqish mumkin',
      );
    }

    await this.assertReadAccess(report.student_id, requester);

    if (dto.status === 'approved' && (dto.grade === undefined || dto.grade === null)) {
      throw new BadRequestException('Tasdiqlash uchun baho (1-5) kiritilishi shart');
    }

    const [updated] = await this.knex('reports')
      .where({ id })
      .update({
        status: dto.status,
        reviewer_feedback: dto.reviewer_feedback ?? null,
        grade: dto.status === 'approved' ? dto.grade : null,
        reviewed_by: requester.sub,
        reviewed_by_role: requester.role,
        reviewed_at: this.knex.fn.now(),
        updated_at: this.knex.fn.now(),
      })
      .returning('*');

    // Talabaga natija haqida xabar
    const isRegrade = report.status === 'approved';
    await this.notifications.notify(Role.Student, report.student_id, {
      type: dto.status === 'approved' ? 'report_approved' : 'report_rejected',
      title:
        dto.status === 'approved'
          ? isRegrade
            ? 'Hisobot bahosi yangilandi'
            : `Hisobotingiz tasdiqlandi (baho: ${dto.grade})`
          : 'Hisobotingiz rad etildi',
      body:
        dto.status === 'rejected'
          ? dto.reviewer_feedback ?? 'Hisobotni tahrirlab qayta yuboring'
          : `${report.report_date ?? ''} sanasidagi hisobot. Baho: ${dto.grade}`,
      link: '/student/reports',
    });

    return updated;
  }

  /** Yakuniy o'rtacha baho va davomat statistikasi (uch tomon ham ko'radi) */
  async getSummary(studentId: number, requester: JwtPayload) {
    await this.assertReadAccess(studentId, requester);

    const reports = await this.knex('reports').where({ student_id: studentId });
    const approved = reports.filter((r) => r.status === 'approved' && r.grade != null);
    const averageGrade = approved.length
      ? Math.round(
          (approved.reduce((s, r) => s + Number(r.grade), 0) / approved.length) * 100,
        ) / 100
      : null;

    const attendance = await this.knex('student_attendance as sa')
      .join('internship_students as ist', 'sa.internship_student_id', 'ist.id')
      .where('ist.student_id', studentId)
      .select('sa.is_present', 'sa.grade');

    const presentDays = attendance.filter((a) => a.is_present).length;
    const attendanceRate = attendance.length
      ? Math.round((presentDays / attendance.length) * 100)
      : null;

    return {
      reportsTotal: reports.length,
      reportsSubmitted: reports.filter((r) => r.status === 'submitted').length,
      reportsApproved: approved.length,
      reportsRejected: reports.filter((r) => r.status === 'rejected').length,
      averageGrade,
      attendanceTotal: attendance.length,
      attendancePresent: presentDays,
      attendanceRate,
    };
  }

  private async notifyMentorOfSubmission(report: any) {
    const student = await this.knex('students').where({ id: report.student_id }).first();
    if (!student) return;
    const payload = {
      type: 'report_submitted',
      title: 'Yangi hisobot keldi',
      body: `${student.full_name}: ${report.report_date ?? ''} sanasidagi hisobot baholashni kutmoqda`,
      link: '/company/reports',
    };
    if (student.mentor_id) {
      await this.notifications.notify(Role.CompanyMentor, student.mentor_id, payload);
    } else if (student.company_id) {
      await this.notifications.notifyCompany(student.company_id, payload);
    }
  }

  private async assertReadAccess(studentId: number, requester: JwtPayload) {
    if (requester.role === Role.SuperAdmin) return;

    if (requester.role === Role.Student && requester.sub !== studentId) {
      throw new ForbiddenException('Access denied');
    }

    if (requester.role === Role.UniversityStaff) {
      const student = await this.knex('students').where({ id: studentId }).first();
      if (!student || student.university_id !== requester.universityId) {
        throw new ForbiddenException('Access denied');
      }
    }

    if (requester.role === Role.CompanyMentor) {
      const student = await this.knex('students').where({ id: studentId }).first();
      if (!student || student.company_id !== requester.companyId) {
        throw new ForbiddenException('Access denied');
      }
    }
  }
}
