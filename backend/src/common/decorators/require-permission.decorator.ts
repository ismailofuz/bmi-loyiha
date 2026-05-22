import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';
export const RequirePermission = (entity: string, operation: string) =>
  SetMetadata(PERMISSION_KEY, { entity, operation });
