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
exports.AcademicController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const require_permission_decorator_1 = require("../common/decorators/require-permission.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const academic_service_1 = require("./academic.service");
const academic_dto_1 = require("./dto/academic.dto");
let AcademicController = class AcademicController {
    academicService;
    constructor(academicService) {
        this.academicService = academicService;
    }
    listDegrees(user) {
        return this.academicService.listDegrees(user);
    }
    createDegree(dto, user) {
        return this.academicService.createDegree(dto, user);
    }
    updateDegree(id, dto, user) {
        return this.academicService.updateDegree(+id, dto, user);
    }
    deleteDegree(id, user) {
        return this.academicService.deleteDegree(+id, user);
    }
    listFaculties(user) {
        return this.academicService.listFaculties(user);
    }
    createFaculty(dto, user) {
        return this.academicService.createFaculty(dto, user);
    }
    updateFaculty(id, dto, user) {
        return this.academicService.updateFaculty(+id, dto, user);
    }
    deleteFaculty(id, user) {
        return this.academicService.deleteFaculty(+id, user);
    }
    listAllDepartments(user) {
        return this.academicService.listAllDepartments(user);
    }
    listDepartments(id, user) {
        return this.academicService.listDepartments(+id, user);
    }
    createDepartment(dto, user) {
        return this.academicService.createDepartment(dto, user);
    }
    updateDepartment(id, dto, user) {
        return this.academicService.updateDepartment(+id, dto, user);
    }
    deleteDepartment(id, user) {
        return this.academicService.deleteDepartment(+id, user);
    }
    listEducationForms(user) {
        return this.academicService.listEducationForms(user);
    }
    createEducationForm(dto, user) {
        return this.academicService.createEducationForm(dto, user);
    }
    updateEducationForm(id, dto, user) {
        return this.academicService.updateEducationForm(+id, dto, user);
    }
    deleteEducationForm(id, user) {
        return this.academicService.deleteEducationForm(+id, user);
    }
    listEducationTypes(user) {
        return this.academicService.listEducationTypes(user);
    }
    createEducationType(dto, user) {
        return this.academicService.createEducationType(dto, user);
    }
    updateEducationType(id, dto, user) {
        return this.academicService.updateEducationType(+id, dto, user);
    }
    deleteEducationType(id, user) {
        return this.academicService.deleteEducationType(+id, user);
    }
    listEducationLanguages(user) {
        return this.academicService.listEducationLanguages(user);
    }
    createEducationLanguage(dto, user) {
        return this.academicService.createEducationLanguage(dto, user);
    }
    updateEducationLanguage(id, dto, user) {
        return this.academicService.updateEducationLanguage(+id, dto, user);
    }
    deleteEducationLanguage(id, user) {
        return this.academicService.deleteEducationLanguage(+id, user);
    }
    listAllDirections(user) {
        return this.academicService.listAllDirections(user);
    }
    listDirections(id, user) {
        return this.academicService.listDirections(+id, user);
    }
    createDirection(dto, user) {
        return this.academicService.createDirection(dto, user);
    }
    updateDirection(id, dto, user) {
        return this.academicService.updateDirection(+id, dto, user);
    }
    deleteDirection(id, user) {
        return this.academicService.deleteDirection(+id, user);
    }
    listAllCourses(user) {
        return this.academicService.listAllCourses(user);
    }
    listCourses(id, user) {
        return this.academicService.listCourses(+id, user);
    }
    createCourse(dto, user) {
        return this.academicService.createCourse(dto, user);
    }
    updateCourse(id, dto, user) {
        return this.academicService.updateCourse(+id, dto, user);
    }
    deleteCourse(id, user) {
        return this.academicService.deleteCourse(+id, user);
    }
    listAllGroups(user) {
        return this.academicService.listAllGroups(user);
    }
    listGroups(id, user) {
        return this.academicService.listGroups(+id, user);
    }
    createGroup(dto, user) {
        return this.academicService.createGroup(dto, user);
    }
    updateGroup(id, dto, user) {
        return this.academicService.updateGroup(+id, dto, user);
    }
    deleteGroup(id, user) {
        return this.academicService.deleteGroup(+id, user);
    }
};
exports.AcademicController = AcademicController;
__decorate([
    (0, common_1.Get)('degrees'),
    (0, require_permission_decorator_1.RequirePermission)('degree', 'read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listDegrees", null);
__decorate([
    (0, common_1.Post)('degrees'),
    (0, require_permission_decorator_1.RequirePermission)('degree', 'create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [academic_dto_1.CreateDegreeDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "createDegree", null);
__decorate([
    (0, common_1.Patch)('degrees/:id'),
    (0, require_permission_decorator_1.RequirePermission)('degree', 'update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, academic_dto_1.UpdateDegreeDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "updateDegree", null);
__decorate([
    (0, common_1.Delete)('degrees/:id'),
    (0, require_permission_decorator_1.RequirePermission)('degree', 'delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "deleteDegree", null);
__decorate([
    (0, common_1.Get)('faculties'),
    (0, require_permission_decorator_1.RequirePermission)('faculty', 'read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listFaculties", null);
__decorate([
    (0, common_1.Post)('faculties'),
    (0, require_permission_decorator_1.RequirePermission)('faculty', 'create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [academic_dto_1.CreateFacultyDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "createFaculty", null);
__decorate([
    (0, common_1.Patch)('faculties/:id'),
    (0, require_permission_decorator_1.RequirePermission)('faculty', 'update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, academic_dto_1.UpdateFacultyDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "updateFaculty", null);
__decorate([
    (0, common_1.Delete)('faculties/:id'),
    (0, require_permission_decorator_1.RequirePermission)('faculty', 'delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "deleteFaculty", null);
__decorate([
    (0, common_1.Get)('departments'),
    (0, require_permission_decorator_1.RequirePermission)('department', 'read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listAllDepartments", null);
__decorate([
    (0, common_1.Get)('faculties/:id/departments'),
    (0, require_permission_decorator_1.RequirePermission)('department', 'read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listDepartments", null);
__decorate([
    (0, common_1.Post)('departments'),
    (0, require_permission_decorator_1.RequirePermission)('department', 'create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [academic_dto_1.CreateDepartmentDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Patch)('departments/:id'),
    (0, require_permission_decorator_1.RequirePermission)('department', 'update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, academic_dto_1.UpdateDepartmentDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "updateDepartment", null);
__decorate([
    (0, common_1.Delete)('departments/:id'),
    (0, require_permission_decorator_1.RequirePermission)('department', 'delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "deleteDepartment", null);
__decorate([
    (0, common_1.Get)('education-forms'),
    (0, require_permission_decorator_1.RequirePermission)('edu_form', 'read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listEducationForms", null);
__decorate([
    (0, common_1.Post)('education-forms'),
    (0, require_permission_decorator_1.RequirePermission)('edu_form', 'create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [academic_dto_1.CreateEducationFormDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "createEducationForm", null);
__decorate([
    (0, common_1.Patch)('education-forms/:id'),
    (0, require_permission_decorator_1.RequirePermission)('edu_form', 'update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, academic_dto_1.UpdateEducationFormDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "updateEducationForm", null);
__decorate([
    (0, common_1.Delete)('education-forms/:id'),
    (0, require_permission_decorator_1.RequirePermission)('edu_form', 'delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "deleteEducationForm", null);
__decorate([
    (0, common_1.Get)('education-types'),
    (0, require_permission_decorator_1.RequirePermission)('edu_type', 'read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listEducationTypes", null);
__decorate([
    (0, common_1.Post)('education-types'),
    (0, require_permission_decorator_1.RequirePermission)('edu_type', 'create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [academic_dto_1.CreateEducationTypeDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "createEducationType", null);
__decorate([
    (0, common_1.Patch)('education-types/:id'),
    (0, require_permission_decorator_1.RequirePermission)('edu_type', 'update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, academic_dto_1.UpdateEducationTypeDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "updateEducationType", null);
__decorate([
    (0, common_1.Delete)('education-types/:id'),
    (0, require_permission_decorator_1.RequirePermission)('edu_type', 'delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "deleteEducationType", null);
__decorate([
    (0, common_1.Get)('education-languages'),
    (0, require_permission_decorator_1.RequirePermission)('edu_lang', 'read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listEducationLanguages", null);
__decorate([
    (0, common_1.Post)('education-languages'),
    (0, require_permission_decorator_1.RequirePermission)('edu_lang', 'create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [academic_dto_1.CreateEducationLanguageDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "createEducationLanguage", null);
__decorate([
    (0, common_1.Patch)('education-languages/:id'),
    (0, require_permission_decorator_1.RequirePermission)('edu_lang', 'update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, academic_dto_1.UpdateEducationLanguageDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "updateEducationLanguage", null);
__decorate([
    (0, common_1.Delete)('education-languages/:id'),
    (0, require_permission_decorator_1.RequirePermission)('edu_lang', 'delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "deleteEducationLanguage", null);
__decorate([
    (0, common_1.Get)('directions'),
    (0, require_permission_decorator_1.RequirePermission)('direction', 'read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listAllDirections", null);
__decorate([
    (0, common_1.Get)('faculties/:id/directions'),
    (0, require_permission_decorator_1.RequirePermission)('direction', 'read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listDirections", null);
__decorate([
    (0, common_1.Post)('directions'),
    (0, require_permission_decorator_1.RequirePermission)('direction', 'create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [academic_dto_1.CreateDirectionDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "createDirection", null);
__decorate([
    (0, common_1.Patch)('directions/:id'),
    (0, require_permission_decorator_1.RequirePermission)('direction', 'update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, academic_dto_1.UpdateDirectionDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "updateDirection", null);
__decorate([
    (0, common_1.Delete)('directions/:id'),
    (0, require_permission_decorator_1.RequirePermission)('direction', 'delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "deleteDirection", null);
__decorate([
    (0, common_1.Get)('courses'),
    (0, require_permission_decorator_1.RequirePermission)('course', 'read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listAllCourses", null);
__decorate([
    (0, common_1.Get)('directions/:id/courses'),
    (0, require_permission_decorator_1.RequirePermission)('course', 'read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listCourses", null);
__decorate([
    (0, common_1.Post)('courses'),
    (0, require_permission_decorator_1.RequirePermission)('course', 'create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [academic_dto_1.CreateCourseDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Patch)('courses/:id'),
    (0, require_permission_decorator_1.RequirePermission)('course', 'update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, academic_dto_1.UpdateCourseDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.Delete)('courses/:id'),
    (0, require_permission_decorator_1.RequirePermission)('course', 'delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "deleteCourse", null);
__decorate([
    (0, common_1.Get)('groups'),
    (0, require_permission_decorator_1.RequirePermission)('group', 'read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listAllGroups", null);
__decorate([
    (0, common_1.Get)('courses/:id/groups'),
    (0, require_permission_decorator_1.RequirePermission)('group', 'read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "listGroups", null);
__decorate([
    (0, common_1.Post)('groups'),
    (0, require_permission_decorator_1.RequirePermission)('group', 'create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [academic_dto_1.CreateGroupDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Patch)('groups/:id'),
    (0, require_permission_decorator_1.RequirePermission)('group', 'update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, academic_dto_1.UpdateGroupDto, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "updateGroup", null);
__decorate([
    (0, common_1.Delete)('groups/:id'),
    (0, require_permission_decorator_1.RequirePermission)('group', 'delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicController.prototype, "deleteGroup", null);
exports.AcademicController = AcademicController = __decorate([
    (0, common_1.Controller)('academic'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permission_guard_1.PermissionGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.UniversityStaff),
    __metadata("design:paramtypes", [academic_service_1.AcademicService])
], AcademicController);
//# sourceMappingURL=academic.controller.js.map