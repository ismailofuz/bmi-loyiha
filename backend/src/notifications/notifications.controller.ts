import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Xabarnomalar')
@ApiBearerAuth('access-token')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.listForUser(user);
  }

  @Get('unread-count')
  unreadCount(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.unreadCount(user);
  }

  @Patch('read-all')
  markAllRead(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.markAllRead(user);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.notificationsService.markRead(+id, user);
  }
}
