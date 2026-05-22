"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const knex_1 = require("knex");
const database_provider_1 = require("../../database/database.provider");
const require_permission_decorator_1 = require("../decorators/require-permission.decorator");
const role_enum_1 = require("../enums/role.enum");
let PermissionGuard = class PermissionGuard {
    reflector;
    knex;
    constructor(reflector, knex) {
        this.reflector = reflector;
        this.knex = knex;
    }
    async canActivate(context) {
        const permission = this.reflector.get(require_permission_decorator_1.PERMISSION_KEY, context.getHandler());
        if (!permission)
            return true;
        const user = context.switchToHttp().getRequest().user;
        if (user.role === role_enum_1.Role.SuperAdmin)
            return true;
        if (user.role !== role_enum_1.Role.UniversityStaff)
            throw new common_1.ForbiddenException();
        const staff = await this.knex('university_staff')
            .where({ id: user.sub })
            .first();
        if (!staff)
            throw new common_1.ForbiddenException();
        if (staff.is_admin)
            return true;
        const perms = staff.permissions ?? {};
        const entityPerms = perms[permission.entity];
        if (!entityPerms) {
            if (permission.operation === 'read')
                return true;
            throw new common_1.ForbiddenException('Permission denied');
        }
        if (entityPerms[permission.operation] !== true) {
            throw new common_1.ForbiddenException('Permission denied');
        }
        return true;
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(database_provider_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [core_1.Reflector, Function])
], PermissionGuard);
//# sourceMappingURL=permission.guard.js.map