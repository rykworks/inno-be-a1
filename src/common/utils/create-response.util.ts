import {
  ApiErrorDetail,
  ApiResponse,
  ApiResponseStatus,
} from '../dto/api-response.dto.js';

export function createResponse<T>(
  status: ApiResponseStatus,
  code: number,
  message: string,
  data: T,
  errors: ApiErrorDetail[] | null = null,
): ApiResponse<T> {
  return {
    status,
    code,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
    errors,
  };
}
