"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('groups', (table) => {
        table.dropUnique(['course_id', 'name'], 'uq_groups_course_name');
    });
    await knex.schema.alterTable('groups', (table) => {
        table.integer('university_id').nullable().unsigned()
            .references('id').inTable('universities').onDelete('CASCADE');
    });
    await knex.raw(`
    UPDATE groups g
    SET university_id = f.university_id
    FROM courses c
    JOIN directions d ON c.direction_id = d.id
    JOIN faculties  f ON d.faculty_id   = f.id
    WHERE g.course_id = c.id
  `);
    await knex.raw(`ALTER TABLE groups ALTER COLUMN university_id SET NOT NULL`);
    await knex.schema.alterTable('groups', (table) => {
        table.unique(['university_id', 'name'], { indexName: 'uq_groups_uni_name' });
    });
}
async function down(knex) {
    await knex.schema.alterTable('groups', (table) => {
        table.dropUnique(['university_id', 'name'], 'uq_groups_uni_name');
    });
    await knex.schema.alterTable('groups', (table) => {
        table.dropColumn('university_id');
    });
    await knex.schema.alterTable('groups', (table) => {
        table.unique(['course_id', 'name'], { indexName: 'uq_groups_course_name' });
    });
}
//# sourceMappingURL=20240017_groups_unique_per_university.js.map