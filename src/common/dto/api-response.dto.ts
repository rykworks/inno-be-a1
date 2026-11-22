import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  meta?: Record<string, unknown>;
}

export class ApiErrorDetail {
  @ApiProperty()
  code: string;

  @ApiProperty()
  field: string;

  @ApiProperty()
  message: string;
}

export class ErrorResponse {
  @ApiProperty()
  success: false;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  errorCode?: string;

  @ApiPropertyOptional({ type: ApiErrorDetail })
  errors?: ApiErrorDetail[];

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;
}
