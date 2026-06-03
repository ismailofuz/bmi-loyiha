import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { buildTemplate, parseSheet } from '../common/utils/excel.util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateCompanyDto, EnrollMentorDto, UpdateCompanyDto, UpdateMentorDto } from './dto/company.dto';
import { CompaniesService } from './companies.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Korxonalar')
@ApiBearerAuth('access-token')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(Role.SuperAdmin)
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto);
  }

  @Get('import/template')
  @Roles(Role.SuperAdmin)
  importTemplate(@Res() res: Response) {
    const headers = ['name', 'industry', 'address', 'contact_email', 'director_full_name', 'phone', 'inn', 'admin_email', 'admin_name', 'admin_position'];
    const buf = buildTemplate(headers, {
      name: 'IT Solutions MChJ', industry: 'IT', admin_email: 'admin@itsolutions.uz', director_full_name: 'Direktorov D.D.', admin_position: 'HR menejeri',
    });
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="korxonalar-shablon.xlsx"',
    });
    res.end(buf);
  }

  @Post('import')
  @Roles(Role.SuperAdmin)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } }))
  async importExcel(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Fayl yuklanmadi');
    const rows = parseSheet(file.buffer);
    if (!rows.length) throw new BadRequestException('Faylda ma\'lumot yo\'q');
    return this.companiesService.importRows(rows);
  }

  @Post('enroll-mentor')
  @Roles(Role.SuperAdmin, Role.CompanyMentor)
  enrollMentor(@Body() dto: EnrollMentorDto, @CurrentUser() user: JwtPayload) {
    return this.companiesService.enrollMentor(dto, user);
  }

  @Get(':id/mentors')
  @Roles(Role.SuperAdmin, Role.CompanyMentor)
  findMentors(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.companiesService.findMentors(+id, user);
  }

  @Get()
  @Roles(Role.SuperAdmin, Role.CompanyMentor, Role.UniversityStaff)
  findAll(@CurrentUser() user: JwtPayload) {
    return this.companiesService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.CompanyMentor, Role.UniversityStaff)
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.companiesService.findOne(+id, user);
  }

  @Patch('mentors/:id')
  @Roles(Role.SuperAdmin, Role.CompanyMentor)
  updateMentor(
    @Param('id') id: string,
    @Body() dto: UpdateMentorDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.companiesService.updateMentor(+id, dto, user);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.CompanyMentor)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.companiesService.update(+id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
