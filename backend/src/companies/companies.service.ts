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
import { CreateCompanyDto, EnrollMentorDto, UpdateCompanyDto, UpdateMentorDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async create(dto: CreateCompanyDto) {
    const { admin_email, admin_password, admin_name, ...companyData } = dto;

    const existing = await this.knex('company_mentors').where({ email: admin_email }).first();
    if (existing) throw new ConflictException('Bu email allaqachon ishlatilgan');

    return this.knex.transaction(async (trx) => {
      const [company] = await trx('companies').insert(companyData).returning('*');

      const password_hash = await bcrypt.hash(admin_password, 10);
      const [mentor] = await trx('company_mentors').insert({
        company_id: company.id,
        full_name: admin_name ?? null,
        email: admin_email,
        password_hash,
        is_admin: true,
      }).returning('*');

      return { ...company, admin_email: mentor.email };
    });
  }

  async findAll(requester: JwtPayload) {
    const query = this.knex('companies').select('*');
    if (requester.role === Role.CompanyMentor) {
      query.where({ id: requester.companyId });
    }
    return query;
  }

  async findOne(id: number, requester: JwtPayload) {
    this.assertAccess(id, requester);
    const company = await this.knex('companies').where({ id }).first();
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: number, dto: UpdateCompanyDto, requester: JwtPayload) {
    this.assertAccess(id, requester);
    await this.findOne(id, requester);
    const [updated] = await this.knex('companies')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    return updated;
  }

  async enrollMentor(dto: EnrollMentorDto, requester: JwtPayload) {
    if (
      requester.role === Role.CompanyMentor &&
      dto.company_id !== requester.companyId
    ) {
      throw new ForbiddenException('Cannot enroll mentor for another company');
    }

    if (requester.role === Role.CompanyMentor && !requester.isAdmin) {
      throw new ForbiddenException('Only company admin can enroll mentors');
    }

    const existing = await this.knex('company_mentors').where({ email: dto.email }).first();
    if (existing) throw new ConflictException('Email already in use');

    return this.knex.transaction(async (trx) => {
      const password_hash = await bcrypt.hash(dto.password, 10);
      const [mentor] = await trx('company_mentors').insert({
        company_id: dto.company_id,
        full_name: dto.full_name,
        phone: dto.phone,
        email: dto.email,
        password_hash,
      }).returning('*');

      return mentor;
    });
  }

  async findMentors(companyId: number, requester: JwtPayload) {
    this.assertAccess(companyId, requester);
    return this.knex('company_mentors')
      .where({ company_id: companyId })
      .select('id', 'full_name', 'phone', 'is_admin', 'email', 'is_active', 'created_at');
  }

  async updateMentor(mentorId: number, dto: UpdateMentorDto, requester: JwtPayload) {
    const mentor = await this.knex('company_mentors').where({ id: mentorId }).first();
    if (!mentor) throw new NotFoundException('Mentor not found');
    this.assertAccess(mentor.company_id, requester);

    if (requester.role === Role.CompanyMentor && !requester.isAdmin) {
      throw new ForbiddenException('Only company admin can edit mentors');
    }

    const { new_password, ...profileData } = dto;
    const update: Record<string, unknown> = { ...profileData, updated_at: this.knex.fn.now() };
    if (new_password) update.password_hash = await bcrypt.hash(new_password, 10);

    const [updated] = await this.knex('company_mentors')
      .where({ id: mentorId })
      .update(update)
      .returning('*');
    return updated;
  }

  async remove(id: number) {
    const deleted = await this.knex('companies').where({ id }).delete();
    if (!deleted) throw new NotFoundException('Company not found');
    return { deleted: true };
  }

  private assertAccess(companyId: number, requester: JwtPayload) {
    if (
      requester.role === Role.CompanyMentor &&
      requester.companyId !== companyId
    ) {
      throw new ForbiddenException('Access denied to this company');
    }
  }
}
