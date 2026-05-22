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
exports.RespondStudentDto = exports.AddStudentDto = exports.RespondInternshipDto = exports.UpdateInternshipDto = exports.CreateInternshipDto = void 0;
const class_validator_1 = require("class-validator");
class CreateInternshipDto {
    company_id;
    supervisor_id;
    internship_start;
    internship_end;
}
exports.CreateInternshipDto = CreateInternshipDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateInternshipDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateInternshipDto.prototype, "supervisor_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "internship_start", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "internship_end", void 0);
class UpdateInternshipDto {
    supervisor_id;
    internship_start;
    internship_end;
}
exports.UpdateInternshipDto = UpdateInternshipDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateInternshipDto.prototype, "supervisor_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateInternshipDto.prototype, "internship_start", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateInternshipDto.prototype, "internship_end", void 0);
class RespondInternshipDto {
    status;
}
exports.RespondInternshipDto = RespondInternshipDto;
__decorate([
    (0, class_validator_1.IsEnum)(['accepted', 'cancelled']),
    __metadata("design:type", String)
], RespondInternshipDto.prototype, "status", void 0);
class AddStudentDto {
    student_id;
}
exports.AddStudentDto = AddStudentDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AddStudentDto.prototype, "student_id", void 0);
class RespondStudentDto {
    status;
}
exports.RespondStudentDto = RespondStudentDto;
__decorate([
    (0, class_validator_1.IsEnum)(['accepted', 'cancelled']),
    __metadata("design:type", String)
], RespondStudentDto.prototype, "status", void 0);
//# sourceMappingURL=internship.dto.js.map