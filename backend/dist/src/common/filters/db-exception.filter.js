"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let DbExceptionFilter = class DbExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        if (exception?.code === '23505') {
            const err = new common_1.ConflictException('Bu nom allaqachon mavjud');
            res.status(409).json({ statusCode: 409, message: err.message });
            return;
        }
        if (exception instanceof common_1.HttpException) {
            res.status(exception.getStatus()).json(exception.getResponse());
            return;
        }
        res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
};
exports.DbExceptionFilter = DbExceptionFilter;
exports.DbExceptionFilter = DbExceptionFilter = __decorate([
    (0, common_1.Catch)()
], DbExceptionFilter);
//# sourceMappingURL=db-exception.filter.js.map