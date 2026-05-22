"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email', 255).notNullable().unique();
        table.string('password_hash', 255).notNullable();
        table
            .enum('role', ['super_admin', 'university_staff', 'company_mentor', 'student'])
            .notNullable();
        table.boolean('is_active').notNullable().defaultTo(true);
        table.timestamps(true, true);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('users');
}
//# sourceMappingURL=20240001_create_users.js.map