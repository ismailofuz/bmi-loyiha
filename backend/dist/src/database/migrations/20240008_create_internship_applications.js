"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('internship_applications', (table) => {
        table.increments('id').primary();
        table.integer('student_id').notNullable().unsigned().references('id').inTable('students').onDelete('CASCADE');
        table.integer('company_id').notNullable().unsigned().references('id').inTable('companies').onDelete('CASCADE');
        table.integer('university_id').notNullable().unsigned().references('id').inTable('universities').onDelete('CASCADE');
        table.enum('status', ['pending', 'accepted', 'rejected']).notNullable().defaultTo('pending');
        table.date('internship_start').nullable();
        table.date('internship_end').nullable();
        table.text('notes').nullable();
        table.timestamps(true, true);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('internship_applications');
}
//# sourceMappingURL=20240008_create_internship_applications.js.map