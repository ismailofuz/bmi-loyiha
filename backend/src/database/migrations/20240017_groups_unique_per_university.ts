import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Drop the course-level unique constraint added in 20240016
  await knex.schema.alterTable('groups', (table) => {
    table.dropUnique(['course_id', 'name'], 'uq_groups_course_name');
  });

  // 2. Add university_id column (nullable first for backfill)
  await knex.schema.alterTable('groups', (table) => {
    table.integer('university_id').nullable().unsigned()
      .references('id').inTable('universities').onDelete('CASCADE');
  });

  // 3. Backfill university_id from the join chain
  await knex.raw(`
    UPDATE groups g
    SET university_id = f.university_id
    FROM courses c
    JOIN directions d ON c.direction_id = d.id
    JOIN faculties  f ON d.faculty_id   = f.id
    WHERE g.course_id = c.id
  `);

  // 4. Make NOT NULL now that all rows are populated
  await knex.raw(`ALTER TABLE groups ALTER COLUMN university_id SET NOT NULL`);

  // 5. Add university-level unique constraint
  await knex.schema.alterTable('groups', (table) => {
    table.unique(['university_id', 'name'], { indexName: 'uq_groups_uni_name' });
  });
}

export async function down(knex: Knex): Promise<void> {
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
