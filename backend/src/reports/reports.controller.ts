import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateReportDto, ReviewReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportsService } from './reports.service';
import { DiaryService } from './diary.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

const ALLOWED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.ms-powerpoint',
];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const UPLOAD_DIR = join(process.cwd(), 'uploads', 'reports');

@ApiTags('Hisobotlar')
@ApiBearerAuth('access-token')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly diaryService: DiaryService,
  ) {}

  @Post()
  @Roles(Role.Student)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['report_date', 'content'],
      properties: {
        report_date: { type: 'string', format: 'date', example: '2026-06-03' },
        content: { type: 'string' },
        location: { type: 'string' },
        status: { type: 'string', enum: ['draft', 'submitted'] },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
          cb(null, UPLOAD_DIR);
        },
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Faqat PDF, DOCX yoki PPTX fayl yuklash mumkin'), false);
        }
      },
    }),
  )
  async create(
    @Body() dto: CreateReportDto,
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const fileInfo = file
      ? { url: `/uploads/reports/${file.filename}`, name: file.originalname, mime: file.mimetype }
      : undefined;
    return this.reportsService.create(dto, user, fileInfo);
  }

  @Get('student/:studentId')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor, Role.Student)
  findAll(@Param('studentId') studentId: string, @CurrentUser() user: JwtPayload) {
    return this.reportsService.findAll(+studentId, user);
  }

  @Get('student/:studentId/summary')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor, Role.Student)
  summary(@Param('studentId') studentId: string, @CurrentUser() user: JwtPayload) {
    return this.reportsService.getSummary(+studentId, user);
  }

  @Get('student/:studentId/diary.pdf')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor, Role.Student)
  async diary(
    @Param('studentId') studentId: string,
    @CurrentUser() user: JwtPayload,
    @Res() res: Response,
  ) {
    const pdf = await this.diaryService.buildDiaryPdf(+studentId, user);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="kundalik-${studentId}.pdf"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
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
  @Roles(Role.SuperAdmin, Role.CompanyMentor)
  review(
    @Param('id') id: string,
    @Body() dto: ReviewReportDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reportsService.review(+id, dto, user);
  }
}
