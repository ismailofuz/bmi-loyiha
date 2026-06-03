import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UniversitiesModule } from './universities/universities.module';
import { CompaniesModule } from './companies/companies.module';
import { StudentsModule } from './students/students.module';
import { JournalModule } from './journal/journal.module';
import { ReportsModule } from './reports/reports.module';
import { ApplicationsModule } from './applications/applications.module';
import { AcademicModule } from './academic/academic.module';
import { InternshipsModule } from './internships/internships.module';
import { AttendanceModule } from './attendance/attendance.module';
import { RegulationsModule } from './regulations/regulations.module';
import { ContractsModule } from './contracts/contracts.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    NotificationsModule,
    AuthModule,
    UsersModule,
    UniversitiesModule,
    CompaniesModule,
    StudentsModule,
    JournalModule,
    ReportsModule,
    ApplicationsModule,
    AcademicModule,
    InternshipsModule,
    AttendanceModule,
    RegulationsModule,
    ContractsModule,
  ],
})
export class AppModule {}
