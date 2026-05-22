import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class DbExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // PostgreSQL unique violation
    if ((exception as any)?.code === '23505') {
      const err = new ConflictException('Bu nom allaqachon mavjud');
      res.status(409).json({ statusCode: 409, message: err.message });
      return;
    }

    // Pass through NestJS HTTP exceptions as-is
    if (exception instanceof HttpException) {
      res.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    // Unknown error
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
}
