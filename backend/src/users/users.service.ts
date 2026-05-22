import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../database/database.provider';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async create(dto: CreateUserDto) {
    const existing = await this.knex('users').where({ email: dto.email }).first();
    if (existing) throw new ConflictException('Email already in use');

    const password_hash = await bcrypt.hash(dto.password, 10);
    const [user] = await this.knex('users')
      .insert({ email: dto.email, password_hash, role: dto.role })
      .returning(['id', 'email', 'role', 'is_active', 'created_at']);

    return user;
  }

  async findAll() {
    return this.knex('users').select('id', 'email', 'role', 'is_active', 'created_at');
  }

  async findOne(id: number) {
    const user = await this.knex('users')
      .where({ id })
      .select('id', 'email', 'role', 'is_active', 'created_at')
      .first();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    const updates: Record<string, unknown> = {};
    if (dto.email) updates.email = dto.email;
    if (dto.password) updates.password_hash = await bcrypt.hash(dto.password, 10);
    if (dto.is_active !== undefined) updates.is_active = dto.is_active;

    const [updated] = await this.knex('users')
      .where({ id })
      .update({ ...updates, updated_at: this.knex.fn.now() })
      .returning(['id', 'email', 'role', 'is_active', 'updated_at']);

    return updated;
  }
}
