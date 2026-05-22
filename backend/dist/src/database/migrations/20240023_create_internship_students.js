"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('internship_students', (table) => {
        table.increments('id').primary();
        table.integer('internship_id').notNullable().unsigned().references('id').inTable('internships').onDelete('CASCADE');
        table.integer('student_id').notNullable().unsigned().references('id').inTable('students').onDelete('CASCADE');
        table.enum('status', ['pending', 'accepted', 'cancelled']).notNullable().defaultTo('pending');
        table.timestamps(true, true);
        table.unique(['internship_id', 'student_id']);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('internship_students');
}
//# sourceMappingURL=20240023_create_internship_students.js.map