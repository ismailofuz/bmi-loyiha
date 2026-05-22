import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('reports', (table) => {
    table.increments('id').primary();
    table
      .integer('student_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('students')
      .onDelete('CASCADE');
    table.integer('week_number').notNullable();
    table.text('content').notNullable();
    table
      .enum('status', ['draft', 'submitted', 'approved', 'rejected'])
      .notNullable()
      .defaultTo('draft');
    table.text('reviewer_feedback').nullable();
    table
      .integer('reviewed_by')
      .nullable()
      .unsigned()
      .references('id')
      .inTable('users');
    table.timestamp('reviewed_at').nullable();
    table.timestamps(true, true);

    // One report per student per week
    table.unique(['student_id', 'week_number']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('reports');
}
