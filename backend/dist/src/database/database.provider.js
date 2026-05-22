"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProvider = exports.KNEX_CONNECTION = void 0;
const knex_1 = __importDefault(require("knex"));
exports.KNEX_CONNECTION = 'KNEX_CONNECTION';
exports.databaseProvider = {
    provide: exports.KNEX_CONNECTION,
    useFactory: () => {
        return (0, knex_1.default)({
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
//# sourceMappingURL=database.provider.js.map