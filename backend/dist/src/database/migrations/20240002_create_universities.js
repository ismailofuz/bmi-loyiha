"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('universities', (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.text('address').nullable();
        table.string('contact_email', 255).nullable();
        table.timestamps(true, true);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('universities');
}
//# sourceMappingURL=20240002_create_universities.js.map