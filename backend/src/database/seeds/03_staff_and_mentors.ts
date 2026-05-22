import type { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  const staffPassword = await bcrypt.hash('Staff@12345', 10);
  const mentorPassword = await bcrypt.hash('Mentor@12345', 10);

  const tatu = await knex('universities').where({ name: 'Toshkent Axborot Texnologiyalari Universiteti' }).first();
  const tdtu = await knex('universities').where({ name: 'Toshkent Davlat Texnika Universiteti' }).first();
  const uzinfocom = await knex('companies').where({ name: 'Uzinfocom' }).first();
  const pdp = await knex('companies').where({ name: 'PDP Academy' }).first();

  const tatuStaffExists = await knex('university_staff').where({ email: 'staff.tatu@system.uz' }).first();
  if (!tatuStaffExists && tatu) {
    await knex('university_staff').insert({
      university_id: tatu.id,
      full_name: 'Dilnoza Yusupova',
      phone: '+998901234567',
      email: 'staff.tatu@system.uz',
      password_hash: staffPassword,
      is_admin: true,
    });
    console.log('✓ TATU staff created → staff.tatu@system.uz / Staff@12345');
  }

  const tdtuStaffExists = await knex('university_staff').where({ email: 'staff.tdtu@system.uz' }).first();
  if (!tdtuStaffExists && tdtu) {
    await knex('university_staff').insert({
      university_id: tdtu.id,
      full_name: 'Jasur Mirzayev',
      phone: '+998901234568',
      email: 'staff.tdtu@system.uz',
      password_hash: staffPassword,
      is_admin: true,
    });
    console.log('✓ TDTU staff created → staff.tdtu@system.uz / Staff@12345');
  }

  const mentor1Exists = await knex('company_mentors').where({ email: 'mentor.uzinfo@system.uz' }).first();
  if (!mentor1Exists && uzinfocom) {
    await knex('company_mentors').insert({
      company_id: uzinfocom.id,
      full_name: 'Sherzod Karimov',
      phone: '+998909876543',
      email: 'mentor.uzinfo@system.uz',
      password_hash: mentorPassword,
      is_admin: true,
    });
    console.log('✓ Uzinfocom mentor created → mentor.uzinfo@system.uz / Mentor@12345');
  }

  const mentor2Exists = await knex('company_mentors').where({ email: 'mentor.pdp@system.uz' }).first();
  if (!mentor2Exists && pdp) {
    await knex('company_mentors').insert({
      company_id: pdp.id,
      full_name: 'Nodira Xolmatova',
      phone: '+998909876544',
      email: 'mentor.pdp@system.uz',
      password_hash: mentorPassword,
      is_admin: true,
    });
    console.log('✓ PDP mentor created → mentor.pdp@system.uz / Mentor@12345');
  }
}
