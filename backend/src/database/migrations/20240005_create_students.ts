import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('students', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('university_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('universities');
    table
      .integer('company_id')
      .nullable()
      .unsigned()
      .references('id')
      .inTable('companies');
    table
      .integer('mentor_id')
      .nullable()
      .unsigned()
      .references('id')
      .inTable('company_mentors');
    table.string('full_name', 255).notNullable();
    table.string('student_number', 100).nullable();
    table.string('phone', 50).nullable();
    table.string('specialty', 255).nullable();
    table.date('internship_start').nullable();
    table.date('internship_end').nullable();
    table
      .enum('status', ['pending', 'active', 'completed', 'dropped'])
      .notNullable()
      .defaultTo('pending');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('students');
}
