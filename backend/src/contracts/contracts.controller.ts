import {
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { ContractsService } from './contracts.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Shartnomalar (PDF)')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get(':uuid')
  async findByUuid(@Param('uuid') uuid: string) {
    return this.contractsService.findByUuid(uuid);
  }

  @Get(':uuid/pdf')
  async downloadPdf(@Param('uuid') uuid: string, @Res() res: Response) {
    await this.contractsService.findByUuid(uuid);
    const filePath = join(process.cwd(), 'uploads', 'contracts', `${uuid}.pdf`);
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'PDF topilmadi' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="contract-${uuid}.pdf"`);
    return res.sendFile(filePath);
  }
}
