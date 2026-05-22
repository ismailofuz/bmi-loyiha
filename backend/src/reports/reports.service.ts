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

@Injectable()
export class ReportsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async create(dto: CreateReportDto, requester: JwtPayload) {
    const [report] = await this.knex('reports')
      .insert({ ...dto, student_id: requester.sub, status: 'draft' })
      .returning('*');
    return report;
  }

  async findAll(studentId: number, requester: JwtPayload) {
    await this.assertReadAccess(studentId, requester);
    return this.knex('reports')
      .where({ student_id: studentId })
      .orderBy('week_number', 'asc');
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

    const [updated] = await this.knex('reports')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');

    return updated;
  }

  async review(id: number, dto: ReviewReportDto, requester: JwtPayload) {
    const report = await this.knex('reports').where({ id }).first();
    if (!report) throw new NotFoundException('Report not found');

    if (report.status !== 'submitted') {
      throw new BadRequestException('Only submitted reports can be reviewed');
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
