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
import { RegulationsService } from './regulations.service';
import { CreateRegulationDto, UpdateRegulationDto } from './dto/regulation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Qaydnomalar')
@ApiBearerAuth('access-token')
@Controller('regulations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RegulationsController {
  constructor(private readonly regulationsService: RegulationsService) {}

  @Post()
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  create(@Body() dto: CreateRegulationDto, @CurrentUser() user: JwtPayload) {
    return this.regulationsService.create(dto, user);
  }

  @Get()
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  findAll(@CurrentUser() user: JwtPayload) {
    return this.regulationsService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.regulationsService.findOne(+id, user);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRegulationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.regulationsService.update(+id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin, Role.UniversityStaff)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.regulationsService.remove(+id, user);
  }
}
