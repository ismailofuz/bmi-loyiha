"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('internship_applications', (table) => {
        table
            .integer('supervisor_id')
            .nullable()
            .unsigned()
            .references('id')
            .inTable('university_staff')
            .onDelete('SET NULL');
    });
}
async function down(knex) {
    await knex.schema.alterTable('internship_applications', (table) => {
        table.dropColumn('supervisor_id');
    });
}
//# sourceMappingURL=20240021_add_supervisor_to_applications.js.map