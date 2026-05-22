"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('students', (table) => {
        table.string('passport_serial', 20).nullable();
        table.string('pin', 14).nullable();
    });
}
async function down(knex) {
    await knex.schema.alterTable('students', (table) => {
        table.dropColumn('passport_serial');
        table.dropColumn('pin');
    });
}
//# sourceMappingURL=20240018_add_passport_pin_to_students.js.map