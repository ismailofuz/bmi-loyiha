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
import { CreateUniversityDto, EnrollStaffDto, UpdateStaffDto, UpdateStaffPermissionsDto, UpdateUniversityDto } from './dto/university.dto';
import { UniversitiesService } from './universities.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Universitetlar')
@ApiBearerAuth('access-token')
@Controller('universities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Post()
  @Roles(Role.SuperAdmin)
  create(@Body() dto: CreateUniversityDto) {
    return this.universitiesService.create(dto);
  }

  @Get('import/template')
  @Roles(Role.SuperAdmin)
  importTemplate(@Res() res: Response) {
    const headers = ['name', 'address', 'contact_email', 'rector_full_name', 'phone', 'inn', 'admin_email', 'admin_name', 'admin_position'];
    const buf = buildTemplate(headers, {
      name: 'Toshkent Davlat Universiteti', admin_email: 'admin@tdu.uz', rector_full_name: 'Rektorov R.R.', admin_position: 'Amaliyot bo\'limi boshlig\'i',
    });
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="universitetlar-shablon.xlsx"',
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
    return this.universitiesService.importRows(rows);
  }

  @Post('enroll-staff')
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  enrollStaff(@Body() dto: EnrollStaffDto, @CurrentUser() user: JwtPayload) {
    return this.universitiesService.enrollStaff(dto, user);
  }

  @Get(':id/staff')
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  findStaff(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.universitiesService.findStaff(+id, user);
  }

  @Get()
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  findAll(@CurrentUser() user: JwtPayload) {
    return this.universitiesService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.universitiesService.findOne(+id, user);
  }

  @Patch('staff/:id/permissions')
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  updateStaffPermissions(
    @Param('id') id: string,
    @Body() dto: UpdateStaffPermissionsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.universitiesService.updateStaffPermissions(+id, dto, user);
  }

  @Patch('staff/:id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  updateStaff(
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.universitiesService.updateStaff(+id, dto, user);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUniversityDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.universitiesService.update(+id, dto, user);
  }

  @Get(':id/stats')
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  getStats(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.universitiesService.getStats(+id, user);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.universitiesService.remove(+id);
  }
}
