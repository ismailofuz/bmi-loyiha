import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('internship_applications', (table) => {
    table.increments('id').primary();
    table.integer('student_id').notNullable().unsigned().references('id').inTable('students').onDelete('CASCADE');
    table.integer('company_id').notNullable().unsigned().references('id').inTable('companies').onDelete('CASCADE');
    table.integer('university_id').notNullable().unsigned().references('id').inTable('universities').onDelete('CASCADE');
    table.enum('status', ['pending', 'accepted', 'rejected']).notNullable().defaultTo('pending');
    table.date('internship_start').nullable();
    table.date('internship_end').nullable();
    table.text('notes').nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('internship_applications');
}
