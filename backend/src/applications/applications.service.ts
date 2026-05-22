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
import { CreateApplicationDto, RespondApplicationDto, UpdateApplicationDto } from './dto/application.dto';

@Injectable()
export class ApplicationsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async create(dto: CreateApplicationDto, requester: JwtPayload) {
    const student = await this.knex('students').where({ id: dto.student_id }).first();
    if (!student) throw new NotFoundException('Student not found');
    if (student.university_id !== requester.universityId) {
      throw new ForbiddenException('Student does not belong to your university');
    }

    const [app] = await this.knex('internship_applications')
      .insert({
        student_id: dto.student_id,
        company_id: dto.company_id,
        university_id: requester.universityId,
        supervisor_id: dto.supervisor_id ?? null,
        internship_start: dto.internship_start,
        internship_end: dto.internship_end,
      })
      .returning('*');

    return app;
  }

  async findAll(requester: JwtPayload) {
    const query = this.knex('internship_applications as ia')
      .join('students as s', 'ia.student_id', 's.id')
      .join('companies as co', 'ia.company_id', 'co.id')
      .join('universities as uni', 'ia.university_id', 'uni.id')
      .leftJoin('university_staff as sup', 'ia.supervisor_id', 'sup.id')
      .select(
        'ia.*',
        's.full_name as student_name',
        'co.name as company_name',
        'uni.name as university_name',
        'sup.full_name as supervisor_name',
      )
      .orderBy('ia.created_at', 'desc');

    if (requester.role === Role.UniversityStaff) {
      query.where('ia.university_id', requester.universityId);
    } else if (requester.role === Role.CompanyMentor) {
      query.where('ia.company_id', requester.companyId);
    }

    return query;
  }

  async update(id: number, dto: UpdateApplicationDto, requester: JwtPayload) {
    const app = await this.knex('internship_applications').where({ id }).first();
    if (!app) throw new NotFoundException('Application not found');
    if (app.university_id !== requester.universityId) {
      throw new ForbiddenException('Access denied');
    }

    await this.knex('internship_applications')
      .where({ id })
      .update({
        ...(dto.company_id    !== undefined && { company_id: dto.company_id }),
        ...(dto.supervisor_id !== undefined && { supervisor_id: dto.supervisor_id }),
        internship_start: dto.internship_start,
        internship_end: dto.internship_end,
        updated_at: this.knex.fn.now(),
      });

    return this.knex('internship_applications').where({ id }).first();
  }

  async respond(id: number, dto: RespondApplicationDto, requester: JwtPayload) {
    const app = await this.knex('internship_applications').where({ id }).first();
    if (!app) throw new NotFoundException('Application not found');
    if (app.company_id !== requester.companyId) {
      throw new ForbiddenException('This application is not directed to your company');
    }
    if (app.status !== 'pending') {
      throw new ForbiddenException('Application has already been responded to');
    }

    await this.knex('internship_applications')
      .where({ id })
      .update({ status: dto.status, updated_at: this.knex.fn.now() });

    return this.knex('internship_applications').where({ id }).first();
  }
}
