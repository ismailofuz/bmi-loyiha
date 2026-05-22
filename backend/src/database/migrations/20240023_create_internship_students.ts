import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('internship_students', (table) => {
    table.increments('id').primary();
    table.integer('internship_id').notNullable().unsigned().references('id').inTable('internships').onDelete('CASCADE');
    table.integer('student_id').notNullable().unsigned().references('id').inTable('students').onDelete('CASCADE');
    table.enum('status', ['pending', 'accepted', 'cancelled']).notNullable().defaultTo('pending');
    table.timestamps(true, true);
    table.unique(['internship_id', 'student_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('internship_students');
}
