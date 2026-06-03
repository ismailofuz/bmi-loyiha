import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('reports', (table) => {
    // Make week_number optional (existing data kept)
    table.integer('week_number').nullable().alter();
    // New fields
    table.date('report_date').nullable();
    table.text('location').nullable();
    table.text('file_url').nullable();
    table.text('file_name').nullable();
    table.text('file_mime').nullable();
  });

  // Add unique constraint per student per date (only for non-null dates)
  await knex.raw(`
    CREATE UNIQUE INDEX reports_student_date_unique
    ON reports (student_id, report_date)
    WHERE report_date IS NOT NULL
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP INDEX IF EXISTS reports_student_date_unique`);
  await knex.schema.alterTable('reports', (table) => {
    table.dropColumn('report_date');
    table.dropColumn('location');
    table.dropColumn('file_url');
    table.dropColumn('file_name');
    table.dropColumn('file_mime');
    table.integer('week_number').notNullable().alter();
  });
}
