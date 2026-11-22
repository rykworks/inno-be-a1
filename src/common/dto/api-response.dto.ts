import { ApiProperty } from '@nestjs/swagger';

export type ApiResponseStatus = 'success' | 'error';

export class ApiMeta {
  @ApiProperty({ example: '2026-11-22T15:00:00.000Z' })
  timestamp: string;
}
export class ApiErrorDetail {
  @ApiProperty({ example: 'USER_ALREADY_EXISTS' })
  code: string;

  @ApiProperty({ example: 'email' })
  field: string;

  @ApiProperty({
    example: "A user with email 'user@example.com' already exists",
  })
  message: string;
}
export class ApiResponse<T> {
  @ApiProperty({ enum: ['success', 'error'], example: 'success' })
  status: ApiResponseStatus;

  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Data retrieved successfully' })
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty({ type: ApiMeta })
  meta: ApiMeta;

  @ApiProperty({ type: [ApiErrorDetail], nullable: true, example: null })
  errors: ApiErrorDetail[] | null;
}

export class ErrorResponse {
  @ApiProperty({ example: 'error' })
  status: 'error';

  @ApiProperty({ example: 400 })
  code: number;

  @ApiProperty({ example: 'Validation error' })
  message: string;

  @ApiProperty({ example: null, nullable: true })
  data: null;

  @ApiProperty({ type: ApiMeta })
  meta: ApiMeta;

  @ApiProperty({ type: [ApiErrorDetail] })
  errors: ApiErrorDetail[];
}
