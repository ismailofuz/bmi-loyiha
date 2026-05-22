"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
    await knex.schema.alterTable('directions', (table) => {
        table.integer('edu_form_id').nullable().unsigned().references('id').inTable('education_forms').onDelete('SET NULL');
        table.integer('edu_type_id').nullable().unsigned().references('id').inTable('education_types').onDelete('SET NULL');
        table.integer('edu_lang_id').nullable().unsigned().references('id').inTable('education_languages').onDelete('SET NULL');
    });
    await knex.schema.createTable('courses', (table) => {
        table.increments('id').primary();
        table.integer('direction_id').notNullable().unsigned().references('id').inTable('directions').onDelete('CASCADE');
        table.integer('number').notNullable();
        table.timestamps(true, true);
    });
    await knex.schema.alterTable('groups', (table) => {
        table.integer('course_id').nullable().unsigned().references('id').inTable('courses').onDelete('CASCADE');
    });
    await knex.schema.alterTable('groups', (table) => {
        table.integer('direction_id').nullable().alter();
    });
    await knex.schema.alterTable('students', (table) => {
        table.integer('course_id').nullable().unsigned().references('id').inTable('courses').onDelete('SET NULL');
    });
}
async function down(knex) {
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
//# sourceMappingURL=20240012_academic_hierarchy_v2.js.map