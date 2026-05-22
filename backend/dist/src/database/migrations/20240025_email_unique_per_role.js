"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('users', (table) => {
        table.dropUnique(['email']);
        table.unique(['email', 'role']);
    });
}
async function down(knex) {
    await knex.schema.alterTable('users', (table) => {
        table.dropUnique(['email', 'role']);
        table.unique(['email']);
    });
}
//# sourceMappingURL=20240025_email_unique_per_role.js.map