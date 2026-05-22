"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('internships', (table) => {
        table.increments('id').primary();
        table.integer('company_id').notNullable().unsigned().references('id').inTable('companies').onDelete('CASCADE');
        table.integer('university_id').notNullable().unsigned().references('id').inTable('universities').onDelete('CASCADE');
        table.integer('supervisor_id').nullable().unsigned().references('id').inTable('university_staff').onDelete('SET NULL');
        table.date('internship_start').notNullable();
        table.date('internship_end').notNullable();
        table.enum('status', ['pending', 'accepted', 'cancelled']).notNullable().defaultTo('pending');
        table.timestamps(true, true);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('internships');
}
//# sourceMappingURL=20240022_create_internships.js.map