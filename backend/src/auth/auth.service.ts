import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../database/database.provider';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { Role } from '../common/enums/role.enum';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    if (dto.role === Role.SuperAdmin) {
      return this.loginSuperAdmin(dto);
    }

    const tableMap: Partial<Record<Role, string>> = {
      [Role.UniversityStaff]: 'university_staff',
      [Role.CompanyMentor]: 'company_mentors',
      [Role.Student]: 'students',
    };

    const table = tableMap[dto.role];
    if (!table) throw new UnauthorizedException('Invalid role');

    const record = await this.knex(table).where({ email: dto.email }).first();
    if (!record) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, record.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (!record.is_active) throw new UnauthorizedException('Account is inactive');

    const payload = this.buildPayloadFromRecord(record, dto.role);
    const token = this.jwtService.sign(payload);

    return { access_token: token, role: dto.role };
  }

  private async loginSuperAdmin(dto: LoginDto) {
    const user = await this.knex('users').where({ email: dto.email, role: Role.SuperAdmin }).first();
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (!user.is_active) throw new UnauthorizedException('Account is inactive');

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token, role: user.role };
  }

  private buildPayloadFromRecord(record: Record<string, unknown>, role: Role): JwtPayload {
    const payload: JwtPayload = {
      sub: record.id as number,
      email: record.email as string,
      role,
    };

    if (role === Role.UniversityStaff) {
      payload.universityId = record.university_id as number;
      payload.isAdmin = (record.is_admin as boolean) ?? false;
    }

    if (role === Role.CompanyMentor) {
      payload.companyId = record.company_id as number;
      payload.isAdmin = (record.is_admin as boolean) ?? false;
    }

    return payload;
  }
}
