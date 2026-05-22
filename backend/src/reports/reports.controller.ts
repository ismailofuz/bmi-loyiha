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
import { CreateReportDto, ReviewReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles(Role.Student)
  create(@Body() dto: CreateReportDto, @CurrentUser() user: JwtPayload) {
    return this.reportsService.create(dto, user);
  }

  @Get('student/:studentId')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor, Role.Student)
  findAll(@Param('studentId') studentId: string, @CurrentUser() user: JwtPayload) {
    return this.reportsService.findAll(+studentId, user);
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor, Role.Student)
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.reportsService.findOne(+id, user);
  }

  @Patch(':id')
  @Roles(Role.Student)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReportDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reportsService.update(+id, dto, user);
  }

  @Patch(':id/review')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor)
  review(
    @Param('id') id: string,
    @Body() dto: ReviewReportDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reportsService.review(+id, dto, user);
  }
}
