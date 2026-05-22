"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('companies', (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.string('industry', 255).nullable();
        table.text('address').nullable();
        table.string('contact_email', 255).nullable();
        table.timestamps(true, true);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('companies');
}
//# sourceMappingURL=20240003_create_companies.js.map