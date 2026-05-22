"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('students', (table) => {
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
            .inTable('universities');
        table
            .integer('company_id')
            .nullable()
            .unsigned()
            .references('id')
            .inTable('companies');
        table
            .integer('mentor_id')
            .nullable()
            .unsigned()
            .references('id')
            .inTable('company_mentors');
        table.string('full_name', 255).notNullable();
        table.string('student_number', 100).nullable();
        table.string('phone', 50).nullable();
        table.string('specialty', 255).nullable();
        table.date('internship_start').nullable();
        table.date('internship_end').nullable();
        table
            .enum('status', ['pending', 'active', 'completed', 'dropped'])
            .notNullable()
            .defaultTo('pending');
        table.timestamps(true, true);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('students');
}
//# sourceMappingURL=20240005_create_students.js.map