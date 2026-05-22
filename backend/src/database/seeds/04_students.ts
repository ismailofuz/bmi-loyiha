import type { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  const studentExists = await knex('students').where({ email: 'student1@system.uz' }).first();
  if (studentExists) return;

  const password_hash = await bcrypt.hash('Student@12345', 10);

  const tatu = await knex('universities').where({ name: 'Toshkent Axborot Texnologiyalari Universiteti' }).first();
  const tdtu = await knex('universities').where({ name: 'Toshkent Davlat Texnika Universiteti' }).first();

  const students = [
    {
      email: 'student1@system.uz',
      full_name: 'Alibek Toshmatov',
      university_id: tatu?.id,
    },
    {
      email: 'student2@system.uz',
      full_name: 'Malika Rahimova',
      university_id: tatu?.id,
    },
    {
      email: 'student3@system.uz',
      full_name: 'Jamshid Umarov',
      university_id: tdtu?.id,
    },
  ];

  for (const s of students) {
    await knex('students').insert({ ...s, password_hash });
    console.log(`✓ Student created → ${s.email} / Student@12345`);
  }
}
