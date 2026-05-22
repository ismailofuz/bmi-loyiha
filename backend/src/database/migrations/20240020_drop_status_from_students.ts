import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table.dropColumn('status');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table.string('status', 20).defaultTo('active').notNullable();
  });
}
