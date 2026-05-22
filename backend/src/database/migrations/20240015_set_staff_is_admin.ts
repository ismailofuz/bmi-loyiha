import type { Knex } from 'knex';

// All currently seeded staff are university administrators.
// Set is_admin = true so they can manage academic structure without
// needing per-entity permission grants.
export async function up(knex: Knex): Promise<void> {
  await knex('university_staff').update({ is_admin: true });
}

export async function down(knex: Knex): Promise<void> {
  await knex('university_staff').update({ is_admin: false });
}
