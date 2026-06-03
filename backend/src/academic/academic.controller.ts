import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { AcademicService } from './academic.service';
import {
  CreateDegreeDto,
  CreateDepartmentDto,
  CreateDirectionDto,
  CreateEducationFormDto,
  CreateEducationLanguageDto,
  CreateEducationTypeDto,
  CreateFacultyDto,
  CreateGroupDto,
  CreateCourseDto,
  UpdateDegreeDto,
  UpdateDepartmentDto,
  UpdateDirectionDto,
  UpdateEducationFormDto,
  UpdateEducationLanguageDto,
  UpdateEducationTypeDto,
  UpdateFacultyDto,
  UpdateGroupDto,
  UpdateCourseDto,
} from './dto/academic.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Akademik')
@ApiBearerAuth('access-token')
@Controller('academic')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
@Roles(Role.SuperAdmin, Role.UniversityStaff)
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  // ── Degrees ────────────────────────────────────────────────────────────────

  @Get('degrees')
  @RequirePermission('degree', 'read')
  listDegrees(@CurrentUser() user: JwtPayload) {
    return this.academicService.listDegrees(user);
  }

  @Post('degrees')
  @RequirePermission('degree', 'create')
  createDegree(@Body() dto: CreateDegreeDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.createDegree(dto, user);
  }

  @Patch('degrees/:id')
  @RequirePermission('degree', 'update')
  updateDegree(@Param('id') id: string, @Body() dto: UpdateDegreeDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.updateDegree(+id, dto, user);
  }

  @Delete('degrees/:id')
  @RequirePermission('degree', 'delete')
  deleteDegree(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.deleteDegree(+id, user);
  }

  // ── Faculties ──────────────────────────────────────────────────────────────

  @Get('faculties')
  @RequirePermission('faculty', 'read')
  listFaculties(@CurrentUser() user: JwtPayload) {
    return this.academicService.listFaculties(user);
  }

  @Post('faculties')
  @RequirePermission('faculty', 'create')
  createFaculty(@Body() dto: CreateFacultyDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.createFaculty(dto, user);
  }

  @Patch('faculties/:id')
  @RequirePermission('faculty', 'update')
  updateFaculty(@Param('id') id: string, @Body() dto: UpdateFacultyDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.updateFaculty(+id, dto, user);
  }

  @Delete('faculties/:id')
  @RequirePermission('faculty', 'delete')
  deleteFaculty(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.deleteFaculty(+id, user);
  }

  // ── Departments ────────────────────────────────────────────────────────────

  @Get('departments')
  @RequirePermission('department', 'read')
  listAllDepartments(@CurrentUser() user: JwtPayload) {
    return this.academicService.listAllDepartments(user);
  }

  @Get('faculties/:id/departments')
  @RequirePermission('department', 'read')
  listDepartments(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.listDepartments(+id, user);
  }

  @Post('departments')
  @RequirePermission('department', 'create')
  createDepartment(@Body() dto: CreateDepartmentDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.createDepartment(dto, user);
  }

  @Patch('departments/:id')
  @RequirePermission('department', 'update')
  updateDepartment(@Param('id') id: string, @Body() dto: UpdateDepartmentDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.updateDepartment(+id, dto, user);
  }

  @Delete('departments/:id')
  @RequirePermission('department', 'delete')
  deleteDepartment(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.deleteDepartment(+id, user);
  }

  // ── Education Forms ────────────────────────────────────────────────────────

  @Get('education-forms')
  @RequirePermission('edu_form', 'read')
  listEducationForms(@CurrentUser() user: JwtPayload) {
    return this.academicService.listEducationForms(user);
  }

  @Post('education-forms')
  @RequirePermission('edu_form', 'create')
  createEducationForm(@Body() dto: CreateEducationFormDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.createEducationForm(dto, user);
  }

  @Patch('education-forms/:id')
  @RequirePermission('edu_form', 'update')
  updateEducationForm(@Param('id') id: string, @Body() dto: UpdateEducationFormDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.updateEducationForm(+id, dto, user);
  }

  @Delete('education-forms/:id')
  @RequirePermission('edu_form', 'delete')
  deleteEducationForm(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.deleteEducationForm(+id, user);
  }

  // ── Education Types ────────────────────────────────────────────────────────

  @Get('education-types')
  @RequirePermission('edu_type', 'read')
  listEducationTypes(@CurrentUser() user: JwtPayload) {
    return this.academicService.listEducationTypes(user);
  }

  @Post('education-types')
  @RequirePermission('edu_type', 'create')
  createEducationType(@Body() dto: CreateEducationTypeDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.createEducationType(dto, user);
  }

  @Patch('education-types/:id')
  @RequirePermission('edu_type', 'update')
  updateEducationType(@Param('id') id: string, @Body() dto: UpdateEducationTypeDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.updateEducationType(+id, dto, user);
  }

  @Delete('education-types/:id')
  @RequirePermission('edu_type', 'delete')
  deleteEducationType(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.deleteEducationType(+id, user);
  }

  // ── Education Languages ────────────────────────────────────────────────────

  @Get('education-languages')
  @RequirePermission('edu_lang', 'read')
  listEducationLanguages(@CurrentUser() user: JwtPayload) {
    return this.academicService.listEducationLanguages(user);
  }

  @Post('education-languages')
  @RequirePermission('edu_lang', 'create')
  createEducationLanguage(@Body() dto: CreateEducationLanguageDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.createEducationLanguage(dto, user);
  }

  @Patch('education-languages/:id')
  @RequirePermission('edu_lang', 'update')
  updateEducationLanguage(@Param('id') id: string, @Body() dto: UpdateEducationLanguageDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.updateEducationLanguage(+id, dto, user);
  }

  @Delete('education-languages/:id')
  @RequirePermission('edu_lang', 'delete')
  deleteEducationLanguage(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.deleteEducationLanguage(+id, user);
  }

  // ── Directions ─────────────────────────────────────────────────────────────

  @Get('directions')
  @RequirePermission('direction', 'read')
  listAllDirections(@CurrentUser() user: JwtPayload) {
    return this.academicService.listAllDirections(user);
  }

  @Get('faculties/:id/directions')
  @RequirePermission('direction', 'read')
  listDirections(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.listDirections(+id, user);
  }

  @Post('directions')
  @RequirePermission('direction', 'create')
  createDirection(@Body() dto: CreateDirectionDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.createDirection(dto, user);
  }

  @Patch('directions/:id')
  @RequirePermission('direction', 'update')
  updateDirection(@Param('id') id: string, @Body() dto: UpdateDirectionDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.updateDirection(+id, dto, user);
  }

  @Delete('directions/:id')
  @RequirePermission('direction', 'delete')
  deleteDirection(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.deleteDirection(+id, user);
  }

  // ── Courses ────────────────────────────────────────────────────────────────

  @Get('courses')
  @RequirePermission('course', 'read')
  listAllCourses(@CurrentUser() user: JwtPayload) {
    return this.academicService.listAllCourses(user);
  }

  @Get('directions/:id/courses')
  @RequirePermission('course', 'read')
  listCourses(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.listCourses(+id, user);
  }

  @Post('courses')
  @RequirePermission('course', 'create')
  createCourse(@Body() dto: CreateCourseDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.createCourse(dto, user);
  }

  @Patch('courses/:id')
  @RequirePermission('course', 'update')
  updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.updateCourse(+id, dto, user);
  }

  @Delete('courses/:id')
  @RequirePermission('course', 'delete')
  deleteCourse(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.deleteCourse(+id, user);
  }

  // ── Groups ─────────────────────────────────────────────────────────────────

  @Get('groups')
  @RequirePermission('group', 'read')
  listAllGroups(@CurrentUser() user: JwtPayload) {
    return this.academicService.listAllGroups(user);
  }

  @Get('courses/:id/groups')
  @RequirePermission('group', 'read')
  listGroups(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.listGroups(+id, user);
  }

  @Post('groups')
  @RequirePermission('group', 'create')
  createGroup(@Body() dto: CreateGroupDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.createGroup(dto, user);
  }

  @Patch('groups/:id')
  @RequirePermission('group', 'update')
  updateGroup(@Param('id') id: string, @Body() dto: UpdateGroupDto, @CurrentUser() user: JwtPayload) {
    return this.academicService.updateGroup(+id, dto, user);
  }

  @Delete('groups/:id')
  @RequirePermission('group', 'delete')
  deleteGroup(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicService.deleteGroup(+id, user);
  }
}
