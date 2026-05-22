"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const db_exception_filter_1 = require("./common/filters/db-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new db_exception_filter_1.DbExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: process.env.FRONTEND_URL ?? 'http://localhost:3090',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`Backend running on http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map