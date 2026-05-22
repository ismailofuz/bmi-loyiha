import type { Knex } from 'knex';

// These fields move to internship_applications; students table should only
// hold academic profile data.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table.dropColumn('student_number');
    table.dropColumn('specialty');
    table.dropColumn('internship_start');
    table.dropColumn('internship_end');
    table.dropColumn('company_id');
    table.dropColumn('mentor_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table.string('student_number', 100).nullable();
    table.string('specialty', 255).nullable();
    table.date('internship_start').nullable();
    table.date('internship_end').nullable();
    table.integer('company_id').nullable().unsigned()
      .references('id').inTable('companies');
    table.integer('mentor_id').nullable().unsigned()
      .references('id').inTable('company_mentors');
  });
}
