"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
async function seed(knex) {
    const student1 = await knex('students').where({ email: 'student1@system.uz' }).first();
    if (!student1)
        return;
    const journalExists = await knex('journal_entries').where({ student_id: student1.id }).first();
    if (!journalExists) {
        await knex('journal_entries').insert([
            {
                student_id: student1.id,
                entry_date: '2026-04-28',
                content: 'Bugun REST API dizayn tamoyillari bo\'yicha o\'qidim va loyiha API dokumentatsiyasini yozdim.',
                mood: 'good',
                tasks_completed: 'API dokumentatsiya, Postman collection',
                challenges: 'Swagger sozlamalarida qiyinchilik bo\'ldi',
            },
            {
                student_id: student1.id,
                entry_date: '2026-04-29',
                content: 'Ma\'lumotlar bazasi optimizatsiyasi bo\'yicha mentor bilan muhokama qildim. Index qo\'shish bo\'yicha amaliy mashg\'ulot.',
                mood: 'excellent',
                tasks_completed: 'DB indekslash, Query optimizatsiya',
                challenges: 'Hech qanday jiddiy qiyinchilik yo\'q edi',
            },
            {
                student_id: student1.id,
                entry_date: '2026-04-30',
                content: 'NestJS interceptor va middleware yozishni o\'rgandim. Logging tizimini loyihaga qo\'shdim.',
                mood: 'good',
                tasks_completed: 'Logging interceptor, Error filter',
                challenges: 'Async context bilan ishlashda muammo chiqdi',
            },
        ]);
        console.log('✓ Sample journal entries created for student1');
    }
    const reportExists = await knex('reports').where({ student_id: student1.id }).first();
    if (!reportExists) {
        await knex('reports').insert([
            {
                student_id: student1.id,
                week_number: 1,
                content: '1-hafta davomida kompaniya bilan tanishish, ish jarayonlari va asosiy texnologiyalar bilan tanishdim. Git workflow va code review jarayonlarini o\'rgandim.',
                status: 'approved',
                reviewer_feedback: 'Ajoyib boshlang\'ich hafta! Keyingi haftada texnik topshiriqlarga o\'ting.',
            },
            {
                student_id: student1.id,
                week_number: 2,
                content: 'Backend API yaratish bo\'yicha birinchi real vazifamni bajardim. NestJS modular arxitekturasini amaliyotda qo\'lladim.',
                status: 'submitted',
                reviewer_feedback: null,
            },
            {
                student_id: student1.id,
                week_number: 3,
                content: 'Ma\'lumotlar bazasi optimizatsiyasi va API testing bo\'yicha ish olib bordim. Jest bilan unit testlar yozdim.',
                status: 'draft',
                reviewer_feedback: null,
            },
        ]);
        console.log('✓ Sample reports created for student1');
    }
}
//# sourceMappingURL=05_sample_journal_and_reports.js.map