import type { Knex } from 'knex';

const DEFAULT_PERMISSIONS = {
  faculty:    { create: false, read: true, update: false, delete: false },
  department: { create: false, read: true, update: false, delete: false },
  direction:  { create: false, read: true, update: false, delete: false },
  group:      { create: false, read: true, update: false, delete: false },
  student:    { create: false, read: true, update: false, delete: false },
  staff:      { create: false, read: true, update: false, delete: false },
};

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('university_staff', (table) => {
    table.boolean('is_admin').notNullable().defaultTo(false);
    table.jsonb('permissions').notNullable().defaultTo(JSON.stringify(DEFAULT_PERMISSIONS));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('university_staff', (table) => {
    table.dropColumn('is_admin');
    table.dropColumn('permissions');
  });
}
