import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('journal_entries', (table) => {
    table.increments('id').primary();
    table
      .integer('student_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('students')
      .onDelete('CASCADE');
    table.date('entry_date').notNullable();
    table.text('content').notNullable();
    table
      .enum('mood', ['excellent', 'good', 'neutral', 'difficult', 'bad'])
      .nullable();
    table.text('tasks_completed').nullable();
    table.text('challenges').nullable();
    table.timestamps(true, true);

    // A student can only have one journal entry per day
    table.unique(['student_id', 'entry_date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('journal_entries');
}
