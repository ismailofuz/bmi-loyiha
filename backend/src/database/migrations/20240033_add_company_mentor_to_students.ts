import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table
      .integer('company_id')
      .nullable()
      .unsigned()
      .references('id')
      .inTable('companies')
      .onDelete('SET NULL');
    table
      .integer('mentor_id')
      .nullable()
      .unsigned()
      .references('id')
      .inTable('company_mentors')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table.dropColumn('company_id');
    table.dropColumn('mentor_id');
  });
}
