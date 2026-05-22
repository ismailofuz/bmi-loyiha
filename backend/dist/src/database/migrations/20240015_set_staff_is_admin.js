"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex('university_staff').update({ is_admin: true });
}
async function down(knex) {
    await knex('university_staff').update({ is_admin: false });
}
//# sourceMappingURL=20240015_set_staff_is_admin.js.map