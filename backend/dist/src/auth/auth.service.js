"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const knex_1 = require("knex");
const database_provider_1 = require("../database/database.provider");
const role_enum_1 = require("../common/enums/role.enum");
let AuthService = class AuthService {
    knex;
    jwtService;
    constructor(knex, jwtService) {
        this.knex = knex;
        this.jwtService = jwtService;
    }
    async login(dto) {
        if (dto.role === role_enum_1.Role.SuperAdmin) {
            return this.loginSuperAdmin(dto);
        }
        const tableMap = {
            [role_enum_1.Role.UniversityStaff]: 'university_staff',
            [role_enum_1.Role.CompanyMentor]: 'company_mentors',
            [role_enum_1.Role.Student]: 'students',
        };
        const table = tableMap[dto.role];
        if (!table)
            throw new common_1.UnauthorizedException('Invalid role');
        const record = await this.knex(table).where({ email: dto.email }).first();
        if (!record)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, record.password_hash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!record.is_active)
            throw new common_1.UnauthorizedException('Account is inactive');
        const payload = this.buildPayloadFromRecord(record, dto.role);
        const token = this.jwtService.sign(payload);
        return { access_token: token, role: dto.role };
    }
    async loginSuperAdmin(dto) {
        const user = await this.knex('users').where({ email: dto.email, role: role_enum_1.Role.SuperAdmin }).first();
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.password_hash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.is_active)
            throw new common_1.UnauthorizedException('Account is inactive');
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return { access_token: token, role: user.role };
    }
    buildPayloadFromRecord(record, role) {
        const payload = {
            sub: record.id,
            email: record.email,
            role,
        };
        if (role === role_enum_1.Role.UniversityStaff) {
            payload.universityId = record.university_id;
            payload.isAdmin = record.is_admin ?? false;
        }
        if (role === role_enum_1.Role.CompanyMentor) {
            payload.companyId = record.company_id;
            payload.isAdmin = record.is_admin ?? false;
        }
        return payload;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map