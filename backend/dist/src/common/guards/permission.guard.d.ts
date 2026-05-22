import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Knex } from 'knex';
export declare class PermissionGuard implements CanActivate {
    private readonly reflector;
    private readonly knex;
    constructor(reflector: Reflector, knex: Knex);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
