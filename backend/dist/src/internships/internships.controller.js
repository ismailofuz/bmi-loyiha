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
exports.InternshipsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const internships_service_1 = require("./internships.service");
const internship_dto_1 = require("./dto/internship.dto");
let InternshipsController = class InternshipsController {
    internshipsService;
    constructor(internshipsService) {
        this.internshipsService = internshipsService;
    }
    create(dto, user) {
        return this.internshipsService.create(dto, user);
    }
    findAll(user) {
        return this.internshipsService.findAll(user);
    }
    findOne(id, user) {
        return this.internshipsService.findOne(+id, user);
    }
    update(id, dto, user) {
        return this.internshipsService.update(+id, dto, user);
    }
    cancel(id, user) {
        return this.internshipsService.cancel(+id, user);
    }
    respond(id, dto, user) {
        return this.internshipsService.respond(+id, dto, user);
    }
    addStudent(id, dto, user) {
        return this.internshipsService.addStudent(+id, dto, user);
    }
    findStudents(id, user) {
        return this.internshipsService.findStudents(+id, user);
    }
    findAllStudents(user) {
        return this.internshipsService.findAllStudents(user);
    }
    cancelStudent(id, user) {
        return this.internshipsService.cancelStudent(+id, user);
    }
    respondStudent(id, dto, user) {
        return this.internshipsService.respondStudent(+id, dto, user);
    }
};
exports.InternshipsController = InternshipsController;
__decorate([
    (0, common_1.Post)('internships'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.UniversityStaff),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [internship_dto_1.CreateInternshipDto, Object]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('internships'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.UniversityStaff, role_enum_1.Role.CompanyMentor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('internships/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.UniversityStaff, role_enum_1.Role.CompanyMentor),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('internships/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.UniversityStaff),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, internship_dto_1.UpdateInternshipDto, Object]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('internships/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.UniversityStaff),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)('internships/:id/respond'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.CompanyMentor),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, internship_dto_1.RespondInternshipDto, Object]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "respond", null);
__decorate([
    (0, common_1.Post)('internships/:id/students'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.UniversityStaff),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, internship_dto_1.AddStudentDto, Object]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "addStudent", null);
__decorate([
    (0, common_1.Get)('internships/:id/students'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.UniversityStaff, role_enum_1.Role.CompanyMentor),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "findStudents", null);
__decorate([
    (0, common_1.Get)('internship-students'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.UniversityStaff, role_enum_1.Role.CompanyMentor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "findAllStudents", null);
__decorate([
    (0, common_1.Delete)('internship-students/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.UniversityStaff),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "cancelStudent", null);
__decorate([
    (0, common_1.Patch)('internship-students/:id/respond'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.CompanyMentor),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, internship_dto_1.RespondStudentDto, Object]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "respondStudent", null);
exports.InternshipsController = InternshipsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [internships_service_1.InternshipsService])
], InternshipsController);
//# sourceMappingURL=internships.controller.js.map