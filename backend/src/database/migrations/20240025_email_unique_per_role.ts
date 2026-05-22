import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropUnique(['email']);
    table.unique(['email', 'role']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropUnique(['email', 'role']);
    table.unique(['email']);
  });
}
