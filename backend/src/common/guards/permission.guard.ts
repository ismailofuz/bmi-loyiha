import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../../database/database.provider';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';
import { Role } from '../enums/role.enum';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<{ entity: string; operation: string }>(
      PERMISSION_KEY,
      context.getHandler(),
    );
    if (!permission) return true;

    const user: JwtPayload = context.switchToHttp().getRequest().user;
    if (user.role === Role.SuperAdmin) return true;
    if (user.role !== Role.UniversityStaff) throw new ForbiddenException();

    const staff = await this.knex('university_staff')
      .where({ id: user.sub })
      .first();
    if (!staff) throw new ForbiddenException();
    if (staff.is_admin) return true;

    const perms: Record<string, Record<string, boolean>> = staff.permissions ?? {};
    const entityPerms = perms[permission.entity];
    if (!entityPerms) {
      if (permission.operation === 'read') return true;
      throw new ForbiddenException('Permission denied');
    }
    if (entityPerms[permission.operation] !== true) {
      throw new ForbiddenException('Permission denied');
    }
    return true;
  }
}
