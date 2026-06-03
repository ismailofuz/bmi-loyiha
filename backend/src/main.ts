import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { DbExceptionFilter } from './common/filters/db-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new DbExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3090',
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  app.setGlobalPrefix('api');

  // ── Swagger / OpenAPI hujjati ──────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Amaliyot platformasi API')
    .setDescription(
      'Talaba amaliyotini boshqarish tizimi REST API. Rollar: super_admin, ' +
      'university_staff, company_mentor, student. Himoyalangan endpointlar uchun ' +
      '`/api/auth/login` dan olingan JWT tokenni "Authorize" tugmasi orqali kiriting.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Auth', 'Autentifikatsiya (login)')
    .addTag('Universitetlar', 'Universitet va xodimlar (super-admin/universitet)')
    .addTag('Korxonalar', 'Korxona va mentorlar (super-admin/korxona)')
    .addTag('Talabalar', 'Talabalar va ommaviy import')
    .addTag('Akademik', 'Fakultet, yo\'nalish, kurs, guruh, ta\'lim meta')
    .addTag('Amaliyotlar', 'Shartnomalar va talaba biriktirishlari')
    .addTag('Hisobotlar', 'Kunlik hisobotlar, baholash, kundalik PDF')
    .addTag('Davomat', 'Davomat va check-in')
    .addTag('Xabarnomalar', 'In-app xabarnomalar')
    .addTag('Shartnomalar (PDF)', 'Shartnoma PDF va QR')
    .addTag('Arizalar', 'Amaliyot arizalari')
    .addTag('Qaydnomalar', 'Universitet qaydnomalari')
    .addTag('Kundalik', 'Kunlik jurnal yozuvlari')
    .addTag('Foydalanuvchilar', 'Tizim foydalanuvchilari (super-admin)')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Amaliyot platformasi API',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}/api`);
}
bootstrap();
