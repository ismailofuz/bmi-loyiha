import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Education meta tables (university-level, shared across all faculties)
  await knex.schema.createTable('education_forms', (table) => {
    table.increments('id').primary();
    table.integer('university_id').notNullable().unsigned().references('id').inTable('universities').onDelete('CASCADE');
    table.string('name', 100).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('education_types', (table) => {
    table.increments('id').primary();
    table.integer('university_id').notNullable().unsigned().references('id').inTable('universities').onDelete('CASCADE');
    table.string('name', 100).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('education_languages', (table) => {
    table.increments('id').primary();
    table.integer('university_id').notNullable().unsigned().references('id').inTable('universities').onDelete('CASCADE');
    table.string('name', 100).notNullable();
    table.timestamps(true, true);
  });

  // Add edu meta FK columns to directions
  await knex.schema.alterTable('directions', (table) => {
    table.integer('edu_form_id').nullable().unsigned().references('id').inTable('education_forms').onDelete('SET NULL');
    table.integer('edu_type_id').nullable().unsigned().references('id').inTable('education_types').onDelete('SET NULL');
    table.integer('edu_lang_id').nullable().unsigned().references('id').inTable('education_languages').onDelete('SET NULL');
  });

  // Courses: one level below direction, above groups
  await knex.schema.createTable('courses', (table) => {
    table.increments('id').primary();
    table.integer('direction_id').notNullable().unsigned().references('id').inTable('directions').onDelete('CASCADE');
    table.integer('number').notNullable();
    table.timestamps(true, true);
  });

  // Migrate groups: replace direction_id with course_id
  await knex.schema.alterTable('groups', (table) => {
    table.integer('course_id').nullable().unsigned().references('id').inTable('courses').onDelete('CASCADE');
  });
  // Make old direction_id nullable (keep for backward compat during migration)
  await knex.schema.alterTable('groups', (table) => {
    table.integer('direction_id').nullable().alter();
  });

  // Add course_id to students
  await knex.schema.alterTable('students', (table) => {
    table.integer('course_id').nullable().unsigned().references('id').inTable('courses').onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('students', (table) => {
    table.dropColumn('course_id');
  });
  await knex.schema.alterTable('groups', (table) => {
    table.dropColumn('course_id');
  });
  await knex.schema.dropTableIfExists('courses');
  await knex.schema.alterTable('directions', (table) => {
    table.dropColumn('edu_lang_id');
    table.dropColumn('edu_type_id');
    table.dropColumn('edu_form_id');
  });
  await knex.schema.dropTableIfExists('education_languages');
  await knex.schema.dropTableIfExists('education_types');
  await knex.schema.dropTableIfExists('education_forms');
}
