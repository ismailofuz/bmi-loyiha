"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('degrees', (table) => {
        table.increments('id').primary();
        table.integer('university_id').notNullable().unsigned()
            .references('id').inTable('universities').onDelete('CASCADE');
        table.string('name', 100).notNullable();
        table.timestamps(true, true);
    });
    await knex.schema.alterTable('directions', (table) => {
        table.integer('degree_id').unsigned().nullable()
            .references('id').inTable('degrees').onDelete('SET NULL');
    });
    await knex.schema.alterTable('students', (table) => {
        table.integer('edu_form_id').unsigned().nullable()
            .references('id').inTable('education_forms').onDelete('SET NULL');
        table.integer('edu_type_id').unsigned().nullable()
            .references('id').inTable('education_types').onDelete('SET NULL');
        table.integer('edu_lang_id').unsigned().nullable()
            .references('id').inTable('education_languages').onDelete('SET NULL');
        table.integer('degree_id').unsigned().nullable()
            .references('id').inTable('degrees').onDelete('SET NULL');
    });
    await knex.raw(`
    UPDATE university_staff
    SET permissions = permissions || '{
      "edu_form":  {"create":false,"read":true,"update":false,"delete":false},
      "edu_type":  {"create":false,"read":true,"update":false,"delete":false},
      "edu_lang":  {"create":false,"read":true,"update":false,"delete":false},
      "course":    {"create":false,"read":true,"update":false,"delete":false},
      "degree":    {"create":false,"read":true,"update":false,"delete":false}
    }'::jsonb
    WHERE permissions IS NOT NULL
  `);
}
async function down(knex) {
    await knex.schema.alterTable('students', (table) => {
        table.dropColumn('edu_form_id');
        table.dropColumn('edu_type_id');
        table.dropColumn('edu_lang_id');
        table.dropColumn('degree_id');
    });
    await knex.schema.alterTable('directions', (table) => {
        table.dropColumn('degree_id');
    });
    await knex.schema.dropTableIfExists('degrees');
}
//# sourceMappingURL=20240013_fix_permissions_add_degrees.js.map