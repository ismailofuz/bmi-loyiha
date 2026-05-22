"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const FULL_DEFAULT = {
    faculty: { create: false, read: true, update: false, delete: false },
    department: { create: false, read: true, update: false, delete: false },
    direction: { create: false, read: true, update: false, delete: false },
    group: { create: false, read: true, update: false, delete: false },
    student: { create: false, read: true, update: false, delete: false },
    staff: { create: false, read: true, update: false, delete: false },
    edu_form: { create: false, read: true, update: false, delete: false },
    edu_type: { create: false, read: true, update: false, delete: false },
    edu_lang: { create: false, read: true, update: false, delete: false },
    course: { create: false, read: true, update: false, delete: false },
    degree: { create: false, read: true, update: false, delete: false },
};
const OLD_DEFAULT = {
    faculty: { create: false, read: true, update: false, delete: false },
    department: { create: false, read: true, update: false, delete: false },
    direction: { create: false, read: true, update: false, delete: false },
    group: { create: false, read: true, update: false, delete: false },
    student: { create: false, read: true, update: false, delete: false },
    staff: { create: false, read: true, update: false, delete: false },
};
async function up(knex) {
    const fullJson = JSON.stringify(FULL_DEFAULT);
    await knex.raw(`ALTER TABLE university_staff ALTER COLUMN permissions SET DEFAULT '${fullJson}'::jsonb`);
    await knex.raw(`
    UPDATE university_staff
    SET permissions = '${fullJson}'::jsonb || permissions
    WHERE NOT jsonb_exists(permissions, 'edu_form')
       OR NOT jsonb_exists(permissions, 'degree')
       OR NOT jsonb_exists(permissions, 'course')
  `);
}
async function down(knex) {
    await knex.raw(`ALTER TABLE university_staff ALTER COLUMN permissions SET DEFAULT '${JSON.stringify(OLD_DEFAULT)}'::jsonb`);
}
//# sourceMappingURL=20240014_update_staff_permissions_default.js.map