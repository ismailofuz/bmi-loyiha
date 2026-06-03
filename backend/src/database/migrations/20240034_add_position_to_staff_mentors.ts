import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('university_staff', (table) => {
    table.string('position').nullable(); // lavozim
  });
  await knex.schema.alterTable('company_mentors', (table) => {
    table.string('position').nullable(); // lavozim
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('university_staff', (table) => {
    table.dropColumn('position');
  });
  await knex.schema.alterTable('company_mentors', (table) => {
    table.dropColumn('position');
  });
}
