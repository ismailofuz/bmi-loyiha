import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../database/database.provider';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { Role } from '../common/enums/role.enum';

export interface NotificationPayload {
  type: string;
  title: string;
  body?: string;
  link?: string;
}

@Injectable()
export class NotificationsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  /** Bitta foydalanuvchiga xabarnoma yaratish */
  async notify(role: Role | string, recipientId: number, payload: NotificationPayload) {
    if (!recipientId) return;
    await this.knex('notifications').insert({
      recipient_role: role,
      recipient_id: recipientId,
      type: payload.type,
      title: payload.title,
      body: payload.body ?? null,
      link: payload.link ?? null,
    });
  }

  /**
   * Universitet tomonini xabardor qilish: agar supervisor biriktirilgan bo'lsa
   * unga, va har doim universitet adminlariga yuboriladi (takrorlanmasdan).
   */
  async notifyUniversity(
    universityId: number,
    supervisorId: number | null | undefined,
    payload: NotificationPayload,
  ) {
    const admins = await this.knex('university_staff')
      .where({ university_id: universityId, is_admin: true, is_active: true })
      .pluck('id');

    const ids = new Set<number>(admins);
    if (supervisorId) ids.add(supervisorId);

    for (const id of ids) {
      await this.notify(Role.UniversityStaff, id, payload);
    }
  }

  /** Korxona tomonini xabardor qilish: admin mentorlarga */
  async notifyCompany(companyId: number, payload: NotificationPayload) {
    const mentors = await this.knex('company_mentors')
      .where({ company_id: companyId, is_active: true })
      .andWhere((qb) => qb.where('is_admin', true))
      .pluck('id');

    for (const id of mentors) {
      await this.notify(Role.CompanyMentor, id, payload);
    }
  }

  async listForUser(requester: JwtPayload) {
    return this.knex('notifications')
      .where({ recipient_role: requester.role, recipient_id: requester.sub })
      .orderBy('created_at', 'desc')
      .limit(50);
  }

  async unreadCount(requester: JwtPayload) {
    const row = await this.knex('notifications')
      .where({ recipient_role: requester.role, recipient_id: requester.sub, is_read: false })
      .count('id as cnt')
      .first();
    return { count: Number((row as { cnt: string })?.cnt ?? 0) };
  }

  async markRead(id: number, requester: JwtPayload) {
    await this.knex('notifications')
      .where({ id, recipient_role: requester.role, recipient_id: requester.sub })
      .update({ is_read: true, updated_at: this.knex.fn.now() });
    return { ok: true };
  }

  async markAllRead(requester: JwtPayload) {
    await this.knex('notifications')
      .where({ recipient_role: requester.role, recipient_id: requester.sub })
      .update({ is_read: true, updated_at: this.knex.fn.now() });
    return { ok: true };
  }
}
