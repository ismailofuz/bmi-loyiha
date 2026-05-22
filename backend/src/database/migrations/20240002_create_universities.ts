import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('universities', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.text('address').nullable();
    table.string('contact_email', 255).nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('universities');
}
