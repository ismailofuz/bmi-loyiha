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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGroupDto = exports.CreateGroupDto = exports.UpdateCourseDto = exports.CreateCourseDto = exports.UpdateDirectionDto = exports.CreateDirectionDto = exports.UpdateEducationLanguageDto = exports.CreateEducationLanguageDto = exports.UpdateEducationTypeDto = exports.CreateEducationTypeDto = exports.UpdateEducationFormDto = exports.CreateEducationFormDto = exports.UpdateDegreeDto = exports.CreateDegreeDto = exports.UpdateDepartmentDto = exports.CreateDepartmentDto = exports.UpdateFacultyDto = exports.CreateFacultyDto = void 0;
const class_validator_1 = require("class-validator");
class CreateFacultyDto {
    name;
    code;
    university_id;
}
exports.CreateFacultyDto = CreateFacultyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFacultyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFacultyDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateFacultyDto.prototype, "university_id", void 0);
class UpdateFacultyDto {
    name;
    code;
}
exports.UpdateFacultyDto = UpdateFacultyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateFacultyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateFacultyDto.prototype, "code", void 0);
class CreateDepartmentDto {
    name;
    faculty_id;
}
exports.CreateDepartmentDto = CreateDepartmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateDepartmentDto.prototype, "faculty_id", void 0);
class UpdateDepartmentDto {
    name;
}
exports.UpdateDepartmentDto = UpdateDepartmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "name", void 0);
class CreateDegreeDto {
    name;
}
exports.CreateDegreeDto = CreateDegreeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDegreeDto.prototype, "name", void 0);
class UpdateDegreeDto {
    name;
}
exports.UpdateDegreeDto = UpdateDegreeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDegreeDto.prototype, "name", void 0);
class CreateEducationFormDto {
    name;
}
exports.CreateEducationFormDto = CreateEducationFormDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEducationFormDto.prototype, "name", void 0);
class UpdateEducationFormDto {
    name;
}
exports.UpdateEducationFormDto = UpdateEducationFormDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEducationFormDto.prototype, "name", void 0);
class CreateEducationTypeDto {
    name;
}
exports.CreateEducationTypeDto = CreateEducationTypeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEducationTypeDto.prototype, "name", void 0);
class UpdateEducationTypeDto {
    name;
}
exports.UpdateEducationTypeDto = UpdateEducationTypeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEducationTypeDto.prototype, "name", void 0);
class CreateEducationLanguageDto {
    name;
}
exports.CreateEducationLanguageDto = CreateEducationLanguageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEducationLanguageDto.prototype, "name", void 0);
class UpdateEducationLanguageDto {
    name;
}
exports.UpdateEducationLanguageDto = UpdateEducationLanguageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEducationLanguageDto.prototype, "name", void 0);
class CreateDirectionDto {
    name;
    code;
    faculty_id;
    edu_form_id;
    edu_type_id;
    edu_lang_id;
    degree_id;
}
exports.CreateDirectionDto = CreateDirectionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDirectionDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDirectionDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateDirectionDto.prototype, "faculty_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDirectionDto.prototype, "edu_form_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDirectionDto.prototype, "edu_type_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDirectionDto.prototype, "edu_lang_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDirectionDto.prototype, "degree_id", void 0);
class UpdateDirectionDto {
    name;
    code;
    edu_form_id;
    edu_type_id;
    edu_lang_id;
    degree_id;
}
exports.UpdateDirectionDto = UpdateDirectionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDirectionDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDirectionDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDirectionDto.prototype, "edu_form_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDirectionDto.prototype, "edu_type_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDirectionDto.prototype, "edu_lang_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDirectionDto.prototype, "degree_id", void 0);
class CreateCourseDto {
    direction_id;
    number;
}
exports.CreateCourseDto = CreateCourseDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "direction_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "number", void 0);
class UpdateCourseDto {
    number;
}
exports.UpdateCourseDto = UpdateCourseDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(6),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateCourseDto.prototype, "number", void 0);
class CreateGroupDto {
    name;
    course_id;
}
exports.CreateGroupDto = CreateGroupDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGroupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateGroupDto.prototype, "course_id", void 0);
class UpdateGroupDto {
    name;
    course_id;
}
exports.UpdateGroupDto = UpdateGroupDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGroupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateGroupDto.prototype, "course_id", void 0);
//# sourceMappingURL=academic.dto.js.map