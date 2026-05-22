import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('companies', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('industry', 255).nullable();
    table.text('address').nullable();
    table.string('contact_email', 255).nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('companies');
}
