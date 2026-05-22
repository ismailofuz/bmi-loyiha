import knex, { Knex } from 'knex';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

export const databaseProvider = {
  provide: KNEX_CONNECTION,
  useFactory: (): Knex => {
    return knex({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST ?? '127.0.0.1',
        port: Number(process.env.DB_PORT ?? 5432),
        user: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? 'postgres',
        database: process.env.DB_NAME ?? 'internship_db',
      },
      pool: { min: 2, max: 10 },
    });
  },
};
