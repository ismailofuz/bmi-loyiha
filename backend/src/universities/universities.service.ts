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
import { CreateUniversityDto, EnrollStaffDto, UpdateStaffDto, UpdateStaffPermissionsDto, UpdateUniversityDto } from './dto/university.dto';
import { genPassword } from '../common/utils/excel.util';

@Injectable()
export class UniversitiesService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  /** Excel'dan ommaviy import. Parol avtomatik generatsiya qilinadi. */
  async importRows(rows: Record<string, string>[]) {
    const created: { full_name: string; email: string; password: string }[] = [];
    const failed: { row: number; label: string; reason: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const rowNum = i + 2; // 1-qator sarlavha
      const name = (r.name ?? '').trim();
      const admin_email = (r.admin_email ?? '').trim();
      if (!name || !admin_email) {
        failed.push({ row: rowNum, label: name || admin_email, reason: "nomi va admin_email majburiy" });
        continue;
      }
      const password = genPassword();
      try {
        await this.create({
          name,
          address: r.address || undefined,
          contact_email: r.contact_email || undefined,
          rector_full_name: r.rector_full_name || undefined,
          phone: r.phone || undefined,
          inn: r.inn || undefined,
          admin_email,
          admin_password: password,
          admin_name: r.admin_name || undefined,
          admin_position: r.admin_position || undefined,
        } as CreateUniversityDto);
        created.push({ full_name: r.admin_name || name, email: admin_email, password });
      } catch (e) {
        failed.push({ row: rowNum, label: name, reason: e instanceof Error ? e.message : 'Xatolik' });
      }
    }
    return { created, failed };
  }

  async create(dto: CreateUniversityDto) {
    const { admin_email, admin_password, admin_name, admin_position, ...universityData } = dto;

    const existing = await this.knex('university_staff').where({ email: admin_email }).first();
    if (existing) throw new ConflictException('Bu email allaqachon ishlatilgan');

    return this.knex.transaction(async (trx) => {
      const [university] = await trx('universities').insert(universityData).returning('*');

      const password_hash = await bcrypt.hash(admin_password, 10);
      const [staff] = await trx('university_staff').insert({
        university_id: university.id,
        full_name: admin_name ?? null,
        position: admin_position ?? null,
        email: admin_email,
        password_hash,
        is_admin: true,
      }).returning('*');

      return { ...university, admin_email: staff.email };
    });
  }

  async findAll(requester: JwtPayload) {
    const query = this.knex('universities').select('*');
    // University staff can only see their own university
    if (requester.role === Role.UniversityStaff) {
      query.where({ id: requester.universityId });
    }
    return query;
  }

  async findOne(id: number, requester: JwtPayload) {
    this.assertAccess(id, requester);
    const university = await this.knex('universities').where({ id }).first();
    if (!university) throw new NotFoundException('University not found');
    return university;
  }

  async update(id: number, dto: UpdateUniversityDto, requester: JwtPayload) {
    this.assertAccess(id, requester);
    await this.findOne(id, requester);
    const [updated] = await this.knex('universities')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    return updated;
  }

  async enrollStaff(dto: EnrollStaffDto, requester: JwtPayload) {
    if (
      requester.role === Role.UniversityStaff &&
      dto.university_id !== requester.universityId
    ) {
      throw new ForbiddenException('Cannot enroll staff for another university');
    }

    if (requester.role === Role.UniversityStaff && !requester.isAdmin) {
      throw new ForbiddenException('Only university admin can enroll staff');
    }

    const existing = await this.knex('university_staff').where({ email: dto.email }).first();
    if (existing) throw new ConflictException('Email already in use');

    return this.knex.transaction(async (trx) => {
      const password_hash = await bcrypt.hash(dto.password, 10);
      const [staff] = await trx('university_staff').insert({
        university_id: dto.university_id,
        full_name: dto.full_name,
        phone: dto.phone,
        position: dto.position ?? null,
        email: dto.email,
        password_hash,
        is_admin: requester.role === Role.SuperAdmin ? (dto.is_admin ?? false) : false,
      }).returning('*');

      return staff;
    });
  }

  async findStaff(universityId: number, requester: JwtPayload) {
    this.assertAccess(universityId, requester);
    return this.knex('university_staff')
      .where({ university_id: universityId })
      .select('id', 'full_name', 'phone', 'position', 'is_admin', 'permissions', 'email', 'is_active', 'created_at');
  }

  async updateStaff(staffId: number, dto: UpdateStaffDto, requester: JwtPayload) {
    const staff = await this.knex('university_staff').where({ id: staffId }).first();
    if (!staff) throw new NotFoundException('Staff not found');
    this.assertAccess(staff.university_id, requester);

    if (requester.role === Role.UniversityStaff && !requester.isAdmin) {
      throw new ForbiddenException('Only university admin can edit staff');
    }

    const { new_password, ...profileData } = dto;
    const update: Record<string, unknown> = { ...profileData, updated_at: this.knex.fn.now() };
    if (new_password) update.password_hash = await bcrypt.hash(new_password, 10);

    const [updated] = await this.knex('university_staff')
      .where({ id: staffId })
      .update(update)
      .returning('*');
    return updated;
  }

  async updateStaffPermissions(staffId: number, dto: UpdateStaffPermissionsDto, requester: JwtPayload) {
    const staff = await this.knex('university_staff').where({ id: staffId }).first();
    if (!staff) throw new NotFoundException('Staff not found');

    if (requester.role !== Role.SuperAdmin) {
      // Must be university admin (is_admin=true) of the same university
      const callerStaff = await this.knex('university_staff')
        .where({ id: requester.sub })
        .first();
      if (!callerStaff?.is_admin || callerStaff.university_id !== staff.university_id) {
        throw new ForbiddenException('Only university admin can manage permissions');
      }
    }

    const update: Record<string, unknown> = { updated_at: this.knex.fn.now() };
    if (dto.permissions !== undefined) update.permissions = JSON.stringify(dto.permissions);
    // is_admin can be changed by SuperAdmin or by the university admin for staff in their own university
    if (dto.is_admin !== undefined) {
      const callerCanToggle = requester.role === Role.SuperAdmin || (() => {
        return true; // already verified callerStaff.is_admin && same university above
      })();
      if (callerCanToggle) update.is_admin = dto.is_admin;
    }

    const [updated] = await this.knex('university_staff')
      .where({ id: staffId })
      .update(update)
      .returning('*');
    return updated;
  }

  async getStats(universityId: number, requester: JwtPayload) {
    this.assertAccess(universityId, requester);

    const [students_count] = await this.knex('students')
      .where({ university_id: universityId })
      .count('id as count');

    const internships = await this.knex('internships').where({ university_id: universityId });
    const internships_count = internships.length;
    const today = new Date().toISOString().split('T')[0];
    const completed_count = internships.filter(
      (i) => i.status === 'accepted' && i.internship_end < today,
    ).length;

    const companies_count = new Set(internships.map((i) => i.company_id)).size;

    return {
      students_count: Number(students_count.count),
      companies_count,
      internships_count,
      completed_count,
    };
  }

  async remove(id: number) {
    const deleted = await this.knex('universities').where({ id }).delete();
    if (!deleted) throw new NotFoundException('University not found');
    return { deleted: true };
  }

  private assertAccess(universityId: number, requester: JwtPayload) {
    if (
      requester.role === Role.UniversityStaff &&
      requester.universityId !== universityId
    ) {
      throw new ForbiddenException('Access denied to this university');
    }
  }
}
