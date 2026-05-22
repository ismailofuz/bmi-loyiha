"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const DEFAULT_PERMISSIONS = {
    faculty: { create: false, read: true, update: false, delete: false },
    department: { create: false, read: true, update: false, delete: false },
    direction: { create: false, read: true, update: false, delete: false },
    group: { create: false, read: true, update: false, delete: false },
    student: { create: false, read: true, update: false, delete: false },
    staff: { create: false, read: true, update: false, delete: false },
};
async function up(knex) {
    await knex.schema.alterTable('university_staff', (table) => {
        table.boolean('is_admin').notNullable().defaultTo(false);
        table.jsonb('permissions').notNullable().defaultTo(JSON.stringify(DEFAULT_PERMISSIONS));
    });
}
async function down(knex) {
    await knex.schema.alterTable('university_staff', (table) => {
        table.dropColumn('is_admin');
        table.dropColumn('permissions');
    });
}
//# sourceMappingURL=20240009_add_staff_permissions.js.map