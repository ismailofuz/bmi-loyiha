import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. degrees table
  await knex.schema.createTable('degrees', (table) => {
    table.increments('id').primary();
    table.integer('university_id').notNullable().unsigned()
      .references('id').inTable('universities').onDelete('CASCADE');
    table.string('name', 100).notNullable();
    table.timestamps(true, true);
  });

  // 2. degree_id on directions
  await knex.schema.alterTable('directions', (table) => {
    table.integer('degree_id').unsigned().nullable()
      .references('id').inTable('degrees').onDelete('SET NULL');
  });

  // 3. edu FK columns on students
  await knex.schema.alterTable('students', (table) => {
    table.integer('edu_form_id').unsigned().nullable()
      .references('id').inTable('education_forms').onDelete('SET NULL');
    table.integer('edu_type_id').unsigned().nullable()
      .references('id').inTable('education_types').onDelete('SET NULL');
    table.integer('edu_lang_id').unsigned().nullable()
      .references('id').inTable('education_languages').onDelete('SET NULL');
    table.integer('degree_id').unsigned().nullable()
      .references('id').inTable('degrees').onDelete('SET NULL');
  });

  // 4. Patch existing university_staff permissions JSON to include new entities
  await knex.raw(`
    UPDATE university_staff
    SET permissions = permissions || '{
      "edu_form":  {"create":false,"read":true,"update":false,"delete":false},
      "edu_type":  {"create":false,"read":true,"update":false,"delete":false},
      "edu_lang":  {"create":false,"read":true,"update":false,"delete":false},
      "course":    {"create":false,"read":true,"update":false,"delete":false},
      "degree":    {"create":false,"read":true,"update":false,"delete":false}
    }'::jsonb
    WHERE permissions IS NOT NULL
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table.dropColumn('edu_form_id');
    table.dropColumn('edu_type_id');
    table.dropColumn('edu_lang_id');
    table.dropColumn('degree_id');
  });
  await knex.schema.alterTable('directions', (table) => {
    table.dropColumn('degree_id');
  });
  await knex.schema.dropTableIfExists('degrees');
}
