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
exports.ReviewReportDto = exports.UpdateReportDto = exports.CreateReportDto = void 0;
const class_validator_1 = require("class-validator");
class CreateReportDto {
    week_number;
    content;
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateReportDto.prototype, "week_number", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "content", void 0);
class UpdateReportDto {
    content;
    status;
}
exports.UpdateReportDto = UpdateReportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['draft', 'submitted']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "status", void 0);
class ReviewReportDto {
    status;
    reviewer_feedback;
}
exports.ReviewReportDto = ReviewReportDto;
__decorate([
    (0, class_validator_1.IsEnum)(['approved', 'rejected']),
    __metadata("design:type", String)
], ReviewReportDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReviewReportDto.prototype, "reviewer_feedback", void 0);
//# sourceMappingURL=report.dto.js.map