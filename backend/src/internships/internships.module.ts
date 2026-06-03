import { Module } from '@nestjs/common';
import { InternshipsController } from './internships.controller';
import { InternshipsService } from './internships.service';
import { ContractsModule } from '../contracts/contracts.module';

@Module({
  imports: [ContractsModule],
  controllers: [InternshipsController],
  providers: [InternshipsService],
})
export class InternshipsModule {}
