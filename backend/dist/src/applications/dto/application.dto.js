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
exports.RespondApplicationDto = exports.UpdateApplicationDto = exports.CreateApplicationDto = void 0;
const class_validator_1 = require("class-validator");
class CreateApplicationDto {
    student_id;
    company_id;
    supervisor_id;
    internship_start;
    internship_end;
}
exports.CreateApplicationDto = CreateApplicationDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateApplicationDto.prototype, "student_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateApplicationDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateApplicationDto.prototype, "supervisor_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "internship_start", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "internship_end", void 0);
class UpdateApplicationDto {
    company_id;
    supervisor_id;
    internship_start;
    internship_end;
}
exports.UpdateApplicationDto = UpdateApplicationDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateApplicationDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateApplicationDto.prototype, "supervisor_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateApplicationDto.prototype, "internship_start", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateApplicationDto.prototype, "internship_end", void 0);
class RespondApplicationDto {
    status;
}
exports.RespondApplicationDto = RespondApplicationDto;
__decorate([
    (0, class_validator_1.IsEnum)(['accepted', 'rejected']),
    __metadata("design:type", String)
], RespondApplicationDto.prototype, "status", void 0);
//# sourceMappingURL=application.dto.js.map