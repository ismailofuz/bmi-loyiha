"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('company_mentors', (table) => {
        table.boolean('is_admin').notNullable().defaultTo(false);
    });
}
async function down(knex) {
    await knex.schema.alterTable('company_mentors', (table) => {
        table.dropColumn('is_admin');
    });
}
//# sourceMappingURL=20240024_add_is_admin_to_company_mentors.js.map