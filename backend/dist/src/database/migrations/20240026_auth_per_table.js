"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('university_staff', (table) => {
        table.string('email', 255).nullable();
        table.string('password_hash', 255).nullable();
        table.boolean('is_active').notNullable().defaultTo(true);
    });
    await knex.raw(`
    UPDATE university_staff us
    SET email = u.email, password_hash = u.password_hash
    FROM users u
    WHERE us.user_id = u.id
  `);
    await knex.schema.alterTable('university_staff', (table) => {
        table.string('email', 255).notNullable().unique().alter();
    });
    await knex.schema.alterTable('company_mentors', (table) => {
        table.string('email', 255).nullable();
        table.string('password_hash', 255).nullable();
        table.boolean('is_active').notNullable().defaultTo(true);
    });
    await knex.raw(`
    UPDATE company_mentors cm
    SET email = u.email, password_hash = u.password_hash
    FROM users u
    WHERE cm.user_id = u.id
  `);
    await knex.schema.alterTable('company_mentors', (table) => {
        table.string('email', 255).notNullable().unique().alter();
    });
    await knex.schema.alterTable('students', (table) => {
        table.string('email', 255).nullable();
        table.string('password_hash', 255).nullable();
        table.boolean('is_active').notNullable().defaultTo(true);
    });
    await knex.raw(`
    UPDATE students s
    SET email = u.email, password_hash = u.password_hash
    FROM users u
    WHERE s.user_id = u.id
  `);
    await knex.schema.alterTable('students', (table) => {
        table.string('email', 255).notNullable().unique().alter();
    });
    await knex.schema.alterTable('university_staff', (table) => {
        table.dropForeign(['user_id']);
        table.dropColumn('user_id');
    });
    await knex.schema.alterTable('company_mentors', (table) => {
        table.dropForeign(['user_id']);
        table.dropColumn('user_id');
    });
    await knex.schema.alterTable('students', (table) => {
        table.dropForeign(['user_id']);
        table.dropColumn('user_id');
    });
}
async function down(knex) {
    await knex.schema.alterTable('university_staff', (table) => {
        table.integer('user_id').nullable().unsigned().references('id').inTable('users');
        table.dropColumn('email');
        table.dropColumn('password_hash');
        table.dropColumn('is_active');
    });
    await knex.schema.alterTable('company_mentors', (table) => {
        table.integer('user_id').nullable().unsigned().references('id').inTable('users');
        table.dropColumn('email');
        table.dropColumn('password_hash');
        table.dropColumn('is_active');
    });
    await knex.schema.alterTable('students', (table) => {
        table.integer('user_id').nullable().unsigned().references('id').inTable('users');
        table.dropColumn('email');
        table.dropColumn('password_hash');
        table.dropColumn('is_active');
    });
}
//# sourceMappingURL=20240026_auth_per_table.js.map