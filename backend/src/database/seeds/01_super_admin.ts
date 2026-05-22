import type { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  const existing = await knex('users').where({ email: 'admin@system.uz' }).first();
  if (existing) return;

  const password_hash = await bcrypt.hash('Admin@12345', 10);
  await knex('users').insert({
    email: 'admin@system.uz',
    password_hash,
    role: 'super_admin',
    is_active: true,
  });

  console.log('✓ Super admin created → admin@system.uz / Admin@12345');
}
