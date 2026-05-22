"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const universities_module_1 = require("./universities/universities.module");
const companies_module_1 = require("./companies/companies.module");
const students_module_1 = require("./students/students.module");
const journal_module_1 = require("./journal/journal.module");
const reports_module_1 = require("./reports/reports.module");
const applications_module_1 = require("./applications/applications.module");
const academic_module_1 = require("./academic/academic.module");
const internships_module_1 = require("./internships/internships.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            universities_module_1.UniversitiesModule,
            companies_module_1.CompaniesModule,
            students_module_1.StudentsModule,
            journal_module_1.JournalModule,
            reports_module_1.ReportsModule,
            applications_module_1.ApplicationsModule,
            academic_module_1.AcademicModule,
            internships_module_1.InternshipsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map