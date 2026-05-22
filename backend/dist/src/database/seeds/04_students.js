"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const bcrypt = __importStar(require("bcrypt"));
async function seed(knex) {
    const studentExists = await knex('students').where({ email: 'student1@system.uz' }).first();
    if (studentExists)
        return;
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
//# sourceMappingURL=04_students.js.map