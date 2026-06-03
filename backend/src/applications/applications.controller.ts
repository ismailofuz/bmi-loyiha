import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateApplicationDto, RespondApplicationDto, UpdateApplicationDto } from './dto/application.dto';
import { ApplicationsService } from './applications.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Arizalar')
@ApiBearerAuth('access-token')
@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.UniversityStaff)
  create(@Body() dto: CreateApplicationDto, @CurrentUser() user: JwtPayload) {
    return this.applicationsService.create(dto, user);
  }

  @Get()
  @Roles(Role.SuperAdmin, Role.UniversityStaff, Role.CompanyMentor)
  findAll(@CurrentUser() user: JwtPayload) {
    return this.applicationsService.findAll(user);
  }

  @Patch(':id')
  @Roles(Role.UniversityStaff)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.update(+id, dto, user);
  }

  @Patch(':id/respond')
  @Roles(Role.CompanyMentor)
  respond(
    @Param('id') id: string,
    @Body() dto: RespondApplicationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.respond(+id, dto, user);
  }
}
