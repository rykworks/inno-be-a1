import { HttpException } from '@nestjs/common';
import { ApiErrorDetail } from '../dto/api-response.dto.js';

export class APIException extends HttpException {
  constructor(
    statusCode: number,
    message: string,
    public readonly errorCode?: string,
    public readonly errors: ApiErrorDetail[] = [],
  ) {
    super({ statusCode, message, errorCode, errors }, statusCode);
  }
}
