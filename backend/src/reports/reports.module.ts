import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { DiaryService } from './diary.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, DiaryService],
})
export class ReportsModule {}
