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
//# sourceMappingURL=03_staff_and_mentors.js.map