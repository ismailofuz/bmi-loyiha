import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { CreateStudentDto, EnrollStudentDto, UpdateStudentDto } from './dto/student.dto';
import { StudentsService } from './students.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Talabalar')
@ApiBearerAuth('access-token')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('enroll')
  @Roles(Role.UniversityStaff)
  enroll(@Body() dto: EnrollStudentDto, @CurrentUser() user: JwtPayload) {
    return this.studentsService.enroll(dto, user);
  }

  @Post()
  @Roles(Role.UniversityStaff)
  create(@Body() dto: CreateStudentDto, @CurrentUser() user: JwtPayload) {
    return this.studentsService.create(dto, user);
  }

  @Get('import/template')
  @Roles(Role.UniversityStaff)
  importTemplate(@Res() res: Response) {
    const headers = ['full_name', 'email', 'passport_serial', 'pin', 'edu_form', 'edu_type', 'edu_lang', 'direction', 'course', 'group'];
    const buf = buildTemplate(headers, {
      full_name: 'Aliyev Ali Valiyevich', email: 'ali@student.uz', passport_serial: 'AA1234567',
      pin: '12345678901234', edu_form: 'Kunduzgi', edu_type: 'Davlat granti', edu_lang: "O'zbek",
      direction: 'Dasturiy injiniring', course: '3', group: '301-guruh',
    });
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="talabalar-shablon.xlsx"',
    });
    res.end(buf);
  }

  @Post('import')
  @Roles(Role.UniversityStaff)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } }))
  async importExcel(@CurrentUser() user: JwtPayload, @UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Fayl yuklanmadi');
    const rows = parseSheet(file.buffer);
    if (!rows.length) throw new BadRequestException('Faylda ma\'lumot yo\'q');
    return this.studentsService.importRows(rows, user);
  }

  @Get()
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor, Role.Student)
  findAll(@CurrentUser() user: JwtPayload, @Query('supervised') supervised?: string) {
    return this.studentsService.findAll(user, supervised === 'true');
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor, Role.Student)
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.studentsService.findOne(+id, user);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.studentsService.update(+id, dto, user);
  }
}
