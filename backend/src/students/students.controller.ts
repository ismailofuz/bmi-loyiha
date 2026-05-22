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
import { CreateStudentDto, EnrollStudentDto, UpdateStudentDto } from './dto/student.dto';
import { StudentsService } from './students.service';

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

  @Get()
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor, Role.Student)
  findAll(@CurrentUser() user: JwtPayload) {
    return this.studentsService.findAll(user);
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
