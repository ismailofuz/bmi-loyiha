import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('regulations', (table) => {
    table.increments('id').primary();
    table
      .integer('university_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('universities')
      .onDelete('CASCADE');
    table.text('title').notNullable();
    table.integer('adoption_year').notNullable();
    table.text('author').notNullable();
    table.text('description').nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('regulations');
}
