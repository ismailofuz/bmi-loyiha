"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('students', (table) => {
        table.integer('faculty_id').nullable().unsigned().references('id').inTable('faculties').onDelete('SET NULL');
        table.integer('direction_id').nullable().unsigned().references('id').inTable('directions').onDelete('SET NULL');
        table.integer('group_id').nullable().unsigned().references('id').inTable('groups').onDelete('SET NULL');
    });
}
async function down(knex) {
    await knex.schema.alterTable('students', (table) => {
        table.dropColumn('faculty_id');
        table.dropColumn('direction_id');
        table.dropColumn('group_id');
    });
}
//# sourceMappingURL=20240011_add_student_academic_fields.js.map