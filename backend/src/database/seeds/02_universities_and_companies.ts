import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  const uniExists = await knex('universities').where({ name: 'Toshkent Axborot Texnologiyalari Universiteti' }).first();
  if (!uniExists) {
    await knex('universities').insert([
      {
        name: 'Toshkent Axborot Texnologiyalari Universiteti',
        address: 'Amir Temur ko\'chasi 108, Toshkent',
        contact_email: 'info@tatu.uz',
      },
      {
        name: 'Toshkent Davlat Texnika Universiteti',
        address: 'Universitet ko\'chasi 2, Toshkent',
        contact_email: 'info@tdtu.uz',
      },
    ]);
    console.log('✓ Universities seeded');
  }

  const coExists = await knex('companies').where({ name: 'Uzinfocom' }).first();
  if (!coExists) {
    await knex('companies').insert([
      {
        name: 'Uzinfocom',
        industry: 'Information Technology',
        address: 'Amir Temur ko\'chasi 34, Toshkent',
        contact_email: 'hr@uzinfocom.uz',
      },
      {
        name: 'PDP Academy',
        industry: 'Education & Technology',
        address: 'Mirzo Ulugbek tumani, Toshkent',
        contact_email: 'hr@pdp.uz',
      },
    ]);
    console.log('✓ Companies seeded');
  }
}
