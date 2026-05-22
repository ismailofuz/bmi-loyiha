"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('reports', (table) => {
        table.increments('id').primary();
        table
            .integer('student_id')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('students')
            .onDelete('CASCADE');
        table.integer('week_number').notNullable();
        table.text('content').notNullable();
        table
            .enum('status', ['draft', 'submitted', 'approved', 'rejected'])
            .notNullable()
            .defaultTo('draft');
        table.text('reviewer_feedback').nullable();
        table
            .integer('reviewed_by')
            .nullable()
            .unsigned()
            .references('id')
            .inTable('users');
        table.timestamp('reviewed_at').nullable();
        table.timestamps(true, true);
        table.unique(['student_id', 'week_number']);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('reports');
}
//# sourceMappingURL=20240007_create_reports.js.map