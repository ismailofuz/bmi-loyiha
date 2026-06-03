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
import { AttendanceService } from './attendance.service';
import { CheckInDto, CreateAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Davomat')
@ApiBearerAuth('access-token')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor)
  create(@Body() dto: CreateAttendanceDto, @CurrentUser() user: JwtPayload) {
    return this.attendanceService.create(dto, user);
  }

  @Post('check-in')
  @Roles(Role.Student)
  checkIn(@Body() dto: CheckInDto, @CurrentUser() user: JwtPayload) {
    return this.attendanceService.checkIn(dto, user);
  }

  @Get('internship-student/:id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor, Role.Student)
  findByInternshipStudent(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.attendanceService.findByInternshipStudent(+id, user);
  }

  @Get('internship/:internshipId')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor)
  findByInternship(@Param('internshipId') internshipId: string, @CurrentUser() user: JwtPayload) {
    return this.attendanceService.findByInternship(+internshipId, user);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAttendanceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.attendanceService.update(+id, dto, user);
  }
}
