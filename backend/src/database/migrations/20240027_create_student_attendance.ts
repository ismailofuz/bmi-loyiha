import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('student_attendance', (table) => {
    table.increments('id').primary();
    table
      .integer('internship_student_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('internship_students')
      .onDelete('CASCADE');
    table.date('date').notNullable();
    table.boolean('is_present').notNullable().defaultTo(true);
    table.integer('grade').nullable().checkBetween([1, 5]);
    table.text('note').nullable();
    table.timestamps(true, true);
    table.unique(['internship_student_id', 'date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('student_attendance');
}
