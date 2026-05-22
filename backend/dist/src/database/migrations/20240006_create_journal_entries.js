"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('journal_entries', (table) => {
        table.increments('id').primary();
        table
            .integer('student_id')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('students')
            .onDelete('CASCADE');
        table.date('entry_date').notNullable();
        table.text('content').notNullable();
        table
            .enum('mood', ['excellent', 'good', 'neutral', 'difficult', 'bad'])
            .nullable();
        table.text('tasks_completed').nullable();
        table.text('challenges').nullable();
        table.timestamps(true, true);
        table.unique(['student_id', 'entry_date']);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('journal_entries');
}
//# sourceMappingURL=20240006_create_journal_entries.js.map