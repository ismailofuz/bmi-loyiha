import { Knex } from 'knex';
export declare const KNEX_CONNECTION = "KNEX_CONNECTION";
export declare const databaseProvider: {
    provide: string;
    useFactory: () => Knex;
};
