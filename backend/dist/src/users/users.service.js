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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const knex_1 = require("knex");
const database_provider_1 = require("../database/database.provider");
let UsersService = class UsersService {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    async create(dto) {
        const existing = await this.knex('users').where({ email: dto.email }).first();
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const password_hash = await bcrypt.hash(dto.password, 10);
        const [user] = await this.knex('users')
            .insert({ email: dto.email, password_hash, role: dto.role })
            .returning(['id', 'email', 'role', 'is_active', 'created_at']);
        return user;
    }
    async findAll() {
        return this.knex('users').select('id', 'email', 'role', 'is_active', 'created_at');
    }
    async findOne(id) {
        const user = await this.knex('users')
            .where({ id })
            .select('id', 'email', 'role', 'is_active', 'created_at')
            .first();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, dto) {
        await this.findOne(id);
        const updates = {};
        if (dto.email)
            updates.email = dto.email;
        if (dto.password)
            updates.password_hash = await bcrypt.hash(dto.password, 10);
        if (dto.is_active !== undefined)
            updates.is_active = dto.is_active;
        const [updated] = await this.knex('users')
            .where({ id })
            .update({ ...updates, updated_at: this.knex.fn.now() })
            .returning(['id', 'email', 'role', 'is_active', 'updated_at']);
        return updated;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], UsersService);
//# sourceMappingURL=users.service.js.map