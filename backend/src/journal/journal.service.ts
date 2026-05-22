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
import { CreateJournalEntryDto, UpdateJournalEntryDto } from './dto/journal.dto';

@Injectable()
export class JournalService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async create(dto: CreateJournalEntryDto, requester: JwtPayload) {
    const [entry] = await this.knex('journal_entries')
      .insert({ ...dto, student_id: requester.sub })
      .returning('*');
    return entry;
  }

  async findAll(studentId: number, requester: JwtPayload) {
    await this.assertReadAccess(studentId, requester);
    return this.knex('journal_entries')
      .where({ student_id: studentId })
      .orderBy('entry_date', 'desc');
  }

  async findOne(id: number, requester: JwtPayload) {
    const entry = await this.knex('journal_entries').where({ id }).first();
    if (!entry) throw new NotFoundException('Journal entry not found');
    await this.assertReadAccess(entry.student_id, requester);
    return entry;
  }

  async update(id: number, dto: UpdateJournalEntryDto, requester: JwtPayload) {
    const entry = await this.knex('journal_entries').where({ id }).first();
    if (!entry) throw new NotFoundException('Journal entry not found');

    // Only the owning student may edit their journal
    if (entry.student_id !== requester.sub) {
      throw new ForbiddenException('Cannot edit another student\'s journal');
    }

    const [updated] = await this.knex('journal_entries')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
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
