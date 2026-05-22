import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table.integer('faculty_id').nullable().unsigned().references('id').inTable('faculties').onDelete('SET NULL');
    table.integer('direction_id').nullable().unsigned().references('id').inTable('directions').onDelete('SET NULL');
    table.integer('group_id').nullable().unsigned().references('id').inTable('groups').onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table.dropColumn('faculty_id');
    table.dropColumn('direction_id');
    table.dropColumn('group_id');
  });
}
