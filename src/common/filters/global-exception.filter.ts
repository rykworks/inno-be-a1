import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ErrorResponse } from '../dto/api-response.dto.js';
import { APIException } from '../exceptions/api.exception.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      message: this.getMessage(exception),
      errorCode: this.getErrorCode(exception),
      errors: this.getValidationErrors(exception),
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    response.status(status).json(errorResponse);
  }

  private getMessage(exception: unknown): string {
    if (!(exception instanceof HttpException)) {
      return 'Internal server error';
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const message = response.message;

      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message)) {
        return message.join(', ');
      }
    }

    return exception.message;
  }

  private getErrorCode(exception: unknown) {
    if (exception instanceof APIException) {
      return exception.errorCode;
    }
  }

  private getValidationErrors(exception: unknown) {
    if (exception instanceof APIException) {
      return exception.errors.length ? exception.errors : undefined;
    }
  }
}
