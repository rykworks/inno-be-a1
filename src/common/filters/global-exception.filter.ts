import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiErrorDetail } from '../dto/api-response.dto.js';
import { APIException } from '../exceptions/api.exception.js';
import { createResponse } from '../utils/create-response.util.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const code =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getMessage(exception);
    const errors = this.getErrors(exception, code, message);

    const errorResponse = createResponse('error', code, message, null, errors);

    response.status(code).json(errorResponse);
  }

  private getMessage(exception: unknown): string {
    if (!(exception instanceof HttpException)) {
      return 'Internal server error';
    }

    const res = exception.getResponse();
    if (typeof res === 'string') {
      return res;
    }

    if (typeof res === 'object' && res !== null && 'message' in res) {
      const msg = (res as { message: string | string[] }).message;
      return Array.isArray(msg) ? msg.join(', ') : msg;
    }

    return exception.message;
  }
  private getErrors(
    exception: unknown,
    code: number,
    message: string,
  ): ApiErrorDetail[] {
    if (exception instanceof APIException && exception.errors.length > 0) {
      return exception.errors;
    }

    return [
      {
        code: code === 500 ? 'INTERNAL_SERVER_ERROR' : `HTTP_${code}`,
        field: 'general',
        message,
      },
    ];
  }
}
