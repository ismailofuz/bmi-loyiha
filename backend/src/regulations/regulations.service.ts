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
import { CreateRegulationDto, UpdateRegulationDto } from './dto/regulation.dto';

@Injectable()
export class RegulationsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async create(dto: CreateRegulationDto, requester: JwtPayload) {
    if (requester.role === Role.UniversityStaff) {
      if (dto.university_id !== requester.universityId) {
        throw new ForbiddenException('Boshqa universitetga qaydnoma qo\'shib bo\'lmaydi');
      }
      if (!requester.isAdmin) {
        throw new ForbiddenException('Faqat university admin qaydnoma qo\'sha oladi');
      }
    }

    const [regulation] = await this.knex('regulations').insert(dto).returning('*');
    return regulation;
  }

  async findAll(requester: JwtPayload) {
    const query = this.knex('regulations').select('*').orderBy('adoption_year', 'desc');
    if (requester.role === Role.UniversityStaff) {
      query.where({ university_id: requester.universityId });
    }
    return query;
  }

  async findOne(id: number, requester: JwtPayload) {
    const regulation = await this.knex('regulations').where({ id }).first();
    if (!regulation) throw new NotFoundException('Qaydnoma topilmadi');
    this.assertAccess(regulation.university_id, requester);
    return regulation;
  }

  async update(id: number, dto: UpdateRegulationDto, requester: JwtPayload) {
    const regulation = await this.knex('regulations').where({ id }).first();
    if (!regulation) throw new NotFoundException('Qaydnoma topilmadi');
    this.assertAccess(regulation.university_id, requester);

    if (requester.role === Role.UniversityStaff && !requester.isAdmin) {
      throw new ForbiddenException('Faqat university admin qaydnomani tahrirlaya oladi');
    }

    const [updated] = await this.knex('regulations')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');
    return updated;
  }

  async remove(id: number, requester: JwtPayload) {
    const regulation = await this.knex('regulations').where({ id }).first();
    if (!regulation) throw new NotFoundException('Qaydnoma topilmadi');
    this.assertAccess(regulation.university_id, requester);

    if (requester.role === Role.UniversityStaff && !requester.isAdmin) {
      throw new ForbiddenException('Faqat university admin qaydnomani o\'chira oladi');
    }

    await this.knex('regulations').where({ id }).delete();
    return { deleted: true };
  }

  private assertAccess(universityId: number, requester: JwtPayload) {
    if (requester.role === Role.SuperAdmin) return;
    if (requester.role === Role.UniversityStaff && requester.universityId !== universityId) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }
  }
}
