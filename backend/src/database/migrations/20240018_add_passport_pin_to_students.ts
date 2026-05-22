import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table.string('passport_serial', 20).nullable();
    table.string('pin', 14).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table.dropColumn('passport_serial');
    table.dropColumn('pin');
  });
}
