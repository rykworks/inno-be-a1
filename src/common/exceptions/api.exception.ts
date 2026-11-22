import { HttpException } from '@nestjs/common';
import { ApiErrorDetail } from '../dto/api-response.dto.js';

export class APIException extends HttpException {
  constructor(
    public readonly code: number,
    message: string,
    public readonly errors: ApiErrorDetail[] = [],
  ) {
    super({ code, message, errors }, code);
  }
}
