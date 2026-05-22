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
import { CreateCompanyDto, EnrollMentorDto, UpdateCompanyDto, UpdateMentorDto } from './dto/company.dto';
import { CompaniesService } from './companies.service';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(Role.SuperAdmin)
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto);
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
