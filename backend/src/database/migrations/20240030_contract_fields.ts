import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('universities', (table) => {
    table.string('rector_full_name', 255).nullable();
    table.string('phone', 50).nullable();
    table.string('inn', 30).nullable();
  });

  await knex.schema.alterTable('companies', (table) => {
    table.string('director_full_name', 255).nullable();
    table.string('phone', 50).nullable();
    table.string('inn', 30).nullable();
  });

  await knex.schema.alterTable('internships', (table) => {
    table.uuid('contract_uuid').nullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('contract_number', 50).nullable();
    table.date('contract_date').nullable();
    table.text('contract_pdf_path').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('internships', (table) => {
    table.dropColumn('contract_uuid');
    table.dropColumn('contract_number');
    table.dropColumn('contract_date');
    table.dropColumn('contract_pdf_path');
  });
  await knex.schema.alterTable('companies', (table) => {
    table.dropColumn('director_full_name');
    table.dropColumn('phone');
    table.dropColumn('inn');
  });
  await knex.schema.alterTable('universities', (table) => {
    table.dropColumn('rector_full_name');
    table.dropColumn('phone');
    table.dropColumn('inn');
  });
}
