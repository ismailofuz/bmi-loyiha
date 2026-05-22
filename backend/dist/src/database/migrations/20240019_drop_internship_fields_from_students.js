"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('students', (table) => {
        table.dropColumn('student_number');
        table.dropColumn('specialty');
        table.dropColumn('internship_start');
        table.dropColumn('internship_end');
        table.dropColumn('company_id');
        table.dropColumn('mentor_id');
    });
}
async function down(knex) {
    await knex.schema.alterTable('students', (table) => {
        table.string('student_number', 100).nullable();
        table.string('specialty', 255).nullable();
        table.date('internship_start').nullable();
        table.date('internship_end').nullable();
        table.integer('company_id').nullable().unsigned()
            .references('id').inTable('companies');
        table.integer('mentor_id').nullable().unsigned()
            .references('id').inTable('company_mentors');
    });
}
//# sourceMappingURL=20240019_drop_internship_fields_from_students.js.map