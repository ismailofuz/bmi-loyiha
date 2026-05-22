"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
async function down(knex) {
    await knex.schema.dropTableIfExists('company_mentors');
    await knex.schema.dropTableIfExists('university_staff');
}
//# sourceMappingURL=20240004_create_profiles.js.map