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
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateUniversityDto, EnrollStaffDto, UpdateStaffDto, UpdateStaffPermissionsDto, UpdateUniversityDto } from './dto/university.dto';
import { UniversitiesService } from './universities.service';

@Controller('universities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Post()
  @Roles(Role.SuperAdmin)
  create(@Body() dto: CreateUniversityDto) {
    return this.universitiesService.create(dto);
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

  @Delete(':id')
  @Roles(Role.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.universitiesService.remove(+id);
  }
}
