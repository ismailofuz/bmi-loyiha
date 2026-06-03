import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    // Qabul qiluvchi: rol + o'sha roldagi jadvaldagi id
    // (super_admin->users, university_staff->university_staff,
    //  company_mentor->company_mentors, student->students)
    table.string('recipient_role').notNullable();
    table.integer('recipient_id').notNullable();
    table.string('type').notNullable();
    table.string('title').notNullable();
    table.text('body').nullable();
    table.string('link').nullable();
    table.boolean('is_read').notNullable().defaultTo(false);
    table.timestamps(true, true);

    table.index(['recipient_role', 'recipient_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('notifications');
}
