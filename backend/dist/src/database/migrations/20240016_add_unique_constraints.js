"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('education_forms', (table) => {
        table.unique(['university_id', 'name'], { indexName: 'uq_edu_forms_uni_name' });
    });
    await knex.schema.alterTable('education_types', (table) => {
        table.unique(['university_id', 'name'], { indexName: 'uq_edu_types_uni_name' });
    });
    await knex.schema.alterTable('education_languages', (table) => {
        table.unique(['university_id', 'name'], { indexName: 'uq_edu_langs_uni_name' });
    });
    await knex.schema.alterTable('faculties', (table) => {
        table.unique(['university_id', 'name'], { indexName: 'uq_faculties_uni_name' });
    });
    await knex.schema.alterTable('departments', (table) => {
        table.unique(['faculty_id', 'name'], { indexName: 'uq_departments_faculty_name' });
    });
    await knex.schema.alterTable('directions', (table) => {
        table.unique(['faculty_id', 'name'], { indexName: 'uq_directions_faculty_name' });
    });
    await knex.schema.alterTable('groups', (table) => {
        table.unique(['course_id', 'name'], { indexName: 'uq_groups_course_name' });
    });
}
async function down(knex) {
    await knex.schema.alterTable('groups', (table) => {
        table.dropUnique(['course_id', 'name'], 'uq_groups_course_name');
    });
    await knex.schema.alterTable('directions', (table) => {
        table.dropUnique(['faculty_id', 'name'], 'uq_directions_faculty_name');
    });
    await knex.schema.alterTable('departments', (table) => {
        table.dropUnique(['faculty_id', 'name'], 'uq_departments_faculty_name');
    });
    await knex.schema.alterTable('faculties', (table) => {
        table.dropUnique(['university_id', 'name'], 'uq_faculties_uni_name');
    });
    await knex.schema.alterTable('education_languages', (table) => {
        table.dropUnique(['university_id', 'name'], 'uq_edu_langs_uni_name');
    });
    await knex.schema.alterTable('education_types', (table) => {
        table.dropUnique(['university_id', 'name'], 'uq_edu_types_uni_name');
    });
    await knex.schema.alterTable('education_forms', (table) => {
        table.dropUnique(['university_id', 'name'], 'uq_edu_forms_uni_name');
    });
}
//# sourceMappingURL=20240016_add_unique_constraints.js.map