"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('faculties', (table) => {
        table.increments('id').primary();
        table.integer('university_id').notNullable().unsigned().references('id').inTable('universities').onDelete('CASCADE');
        table.string('name', 255).notNullable();
        table.string('code', 50).nullable();
        table.timestamps(true, true);
    });
    await knex.schema.createTable('departments', (table) => {
        table.increments('id').primary();
        table.integer('faculty_id').notNullable().unsigned().references('id').inTable('faculties').onDelete('CASCADE');
        table.string('name', 255).notNullable();
        table.timestamps(true, true);
    });
    await knex.schema.createTable('directions', (table) => {
        table.increments('id').primary();
        table.integer('faculty_id').notNullable().unsigned().references('id').inTable('faculties').onDelete('CASCADE');
        table.string('name', 255).notNullable();
        table.string('code', 50).nullable();
        table.timestamps(true, true);
    });
    await knex.schema.createTable('groups', (table) => {
        table.increments('id').primary();
        table.integer('direction_id').notNullable().unsigned().references('id').inTable('directions').onDelete('CASCADE');
        table.string('name', 100).notNullable();
        table.timestamps(true, true);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('groups');
    await knex.schema.dropTableIfExists('directions');
    await knex.schema.dropTableIfExists('departments');
    await knex.schema.dropTableIfExists('faculties');
}
//# sourceMappingURL=20240010_create_academic_hierarchy.js.map