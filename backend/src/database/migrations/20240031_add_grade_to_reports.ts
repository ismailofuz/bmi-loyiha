import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 5-ballik baho har bir hisobotga
  await knex.schema.alterTable('reports', (table) => {
    table.integer('grade').nullable().checkBetween([1, 5]);
    // reviewed_by endi har xil jadvaldagi foydalanuvchi bo'lishi mumkin
    // (company_mentor / university_staff / users), shuning uchun rolni saqlaymiz
    table.string('reviewed_by_role').nullable();
  });

  // Eski reviewed_by -> users FK auth-per-table dan keyin noto'g'ri:
  // mentor/staff id lari users jadvalida bo'lmasligi mumkin -> FK buziladi.
  // FK ni olib tashlaymiz (ustun integer sifatida qoladi).
  await knex.raw(
    `ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_reviewed_by_foreign`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('reports', (table) => {
    table.dropColumn('grade');
    table.dropColumn('reviewed_by_role');
  });
}
