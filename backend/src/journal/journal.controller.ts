import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateJournalEntryDto, UpdateJournalEntryDto } from './dto/journal.dto';
import { JournalService } from './journal.service';

@Controller('journal')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  @Roles(Role.Student)
  create(@Body() dto: CreateJournalEntryDto, @CurrentUser() user: JwtPayload) {
    return this.journalService.create(dto, user);
  }

  @Get('student/:studentId')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor, Role.Student)
  findAll(@Param('studentId') studentId: string, @CurrentUser() user: JwtPayload) {
    return this.journalService.findAll(+studentId, user);
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor, Role.Student)
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.journalService.findOne(+id, user);
  }

  @Patch(':id')
  @Roles(Role.Student)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateJournalEntryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.journalService.update(+id, dto, user);
  }
}
