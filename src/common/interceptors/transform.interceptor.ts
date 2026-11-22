import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto.js';
import { createResponse } from '../utils/create-response.util.js';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next
      .handle()
      .pipe(
        map((data: T) =>
          createResponse(
            'success',
            response.statusCode,
            'Success',
            (data ?? null) as T,
            null,
          ),
        ),
      );
  }
}
