import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // University staff profile — links a user to a university
  await knex.schema.createTable('university_staff', (table) => {
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
      .inTable('universities')
      .onDelete('CASCADE');
    table.string('full_name', 255).nullable();
    table.string('phone', 50).nullable();
    table.timestamps(true, true);
  });

  // Company mentor profile — links a user to a company
  await knex.schema.createTable('company_mentors', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('company_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('companies')
      .onDelete('CASCADE');
    table.string('full_name', 255).nullable();
    table.string('phone', 50).nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('company_mentors');
  await knex.schema.dropTableIfExists('university_staff');
}
