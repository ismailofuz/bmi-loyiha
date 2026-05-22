import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { InternshipsService } from './internships.service';
import {
  AddStudentDto,
  CreateInternshipDto,
  RespondInternshipDto,
  RespondStudentDto,
  UpdateInternshipDto,
} from './dto/internship.dto';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class InternshipsController {
  constructor(private readonly internshipsService: InternshipsService) {}

  // ── Shartnomalar ────────────────────────────────────────────────

  @Post('internships')
  @Roles(Role.UniversityStaff)
  create(@Body() dto: CreateInternshipDto, @CurrentUser() user: JwtPayload) {
    return this.internshipsService.create(dto, user);
  }

  @Get('internships')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor)
  findAll(@CurrentUser() user: JwtPayload) {
    return this.internshipsService.findAll(user);
  }

  @Get('internships/:id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor)
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.internshipsService.findOne(+id, user);
  }

  @Patch('internships/:id')
  @Roles(Role.UniversityStaff)
  update(@Param('id') id: string, @Body() dto: UpdateInternshipDto, @CurrentUser() user: JwtPayload) {
    return this.internshipsService.update(+id, dto, user);
  }

  @Delete('internships/:id')
  @Roles(Role.UniversityStaff)
  cancel(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.internshipsService.cancel(+id, user);
  }

  @Patch('internships/:id/respond')
  @Roles(Role.CompanyMentor)
  respond(@Param('id') id: string, @Body() dto: RespondInternshipDto, @CurrentUser() user: JwtPayload) {
    return this.internshipsService.respond(+id, dto, user);
  }

  // ── Talaba biriktirishlari (nested) ────────────────────────────

  @Post('internships/:id/students')
  @Roles(Role.UniversityStaff)
  addStudent(@Param('id') id: string, @Body() dto: AddStudentDto, @CurrentUser() user: JwtPayload) {
    return this.internshipsService.addStudent(+id, dto, user);
  }

  @Get('internships/:id/students')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor)
  findStudents(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.internshipsService.findStudents(+id, user);
  }

  // ── Talaba biriktirishlari (flat) ──────────────────────────────

  @Get('internship-students')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor)
  findAllStudents(@CurrentUser() user: JwtPayload) {
    return this.internshipsService.findAllStudents(user);
  }

  @Delete('internship-students/:id')
  @Roles(Role.UniversityStaff)
  cancelStudent(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.internshipsService.cancelStudent(+id, user);
  }

  @Patch('internship-students/:id/respond')
  @Roles(Role.CompanyMentor)
  respondStudent(@Param('id') id: string, @Body() dto: RespondStudentDto, @CurrentUser() user: JwtPayload) {
    return this.internshipsService.respondStudent(+id, dto, user);
  }
}
