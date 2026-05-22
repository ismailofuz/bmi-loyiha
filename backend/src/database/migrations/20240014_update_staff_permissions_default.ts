import type { Knex } from 'knex';

const FULL_DEFAULT = {
  faculty:    { create: false, read: true, update: false, delete: false },
  department: { create: false, read: true, update: false, delete: false },
  direction:  { create: false, read: true, update: false, delete: false },
  group:      { create: false, read: true, update: false, delete: false },
  student:    { create: false, read: true, update: false, delete: false },
  staff:      { create: false, read: true, update: false, delete: false },
  edu_form:   { create: false, read: true, update: false, delete: false },
  edu_type:   { create: false, read: true, update: false, delete: false },
  edu_lang:   { create: false, read: true, update: false, delete: false },
  course:     { create: false, read: true, update: false, delete: false },
  degree:     { create: false, read: true, update: false, delete: false },
};

const OLD_DEFAULT = {
  faculty:    { create: false, read: true, update: false, delete: false },
  department: { create: false, read: true, update: false, delete: false },
  direction:  { create: false, read: true, update: false, delete: false },
  group:      { create: false, read: true, update: false, delete: false },
  student:    { create: false, read: true, update: false, delete: false },
  staff:      { create: false, read: true, update: false, delete: false },
};

export async function up(knex: Knex): Promise<void> {
  const fullJson = JSON.stringify(FULL_DEFAULT);

  // ALTER TABLE DDL doesn't support parameterized bindings
  await knex.raw(
    `ALTER TABLE university_staff ALTER COLUMN permissions SET DEFAULT '${fullJson}'::jsonb`,
  );

  // Patch existing staff missing the new keys (enrolled between migration 20240013 and now).
  // Use jsonb_exists() to avoid ? operator conflicting with Knex binding syntax.
  await knex.raw(`
    UPDATE university_staff
    SET permissions = '${fullJson}'::jsonb || permissions
    WHERE NOT jsonb_exists(permissions, 'edu_form')
       OR NOT jsonb_exists(permissions, 'degree')
       OR NOT jsonb_exists(permissions, 'course')
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE university_staff ALTER COLUMN permissions SET DEFAULT '${JSON.stringify(OLD_DEFAULT)}'::jsonb`,
  );
}
