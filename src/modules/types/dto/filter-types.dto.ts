import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterTypesDto {
  @ApiPropertyOptional({ description: 'Search term matched against the type name' })
  q?: string;

  @ApiPropertyOptional({ type: 'integer', minimum: 1 })
  page?: number;

  @ApiPropertyOptional({ type: 'integer', minimum: 1 })
  limit?: number;

  @ApiPropertyOptional({ type: 'integer', minimum: 1 })
  take?: number;
}
