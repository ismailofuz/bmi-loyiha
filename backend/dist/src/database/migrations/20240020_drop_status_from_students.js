"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('students', (table) => {
        table.dropColumn('status');
    });
}
async function down(knex) {
    await knex.schema.alterTable('students', (table) => {
        table.string('status', 20).defaultTo('active').notNullable();
    });
}
//# sourceMappingURL=20240020_drop_status_from_students.js.map