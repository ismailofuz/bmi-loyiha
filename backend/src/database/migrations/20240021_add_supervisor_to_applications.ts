import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('internship_applications', (table) => {
    table
      .integer('supervisor_id')
      .nullable()
      .unsigned()
      .references('id')
      .inTable('university_staff')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('internship_applications', (table) => {
    table.dropColumn('supervisor_id');
  });
}
