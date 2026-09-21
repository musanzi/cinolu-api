import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterSectorsDto {
  @ApiPropertyOptional({ description: 'Search term matched against the sector name' })
  q?: string;

  @ApiPropertyOptional({ type: 'integer', minimum: 1 })
  page?: number;

  @ApiPropertyOptional({ type: 'integer', minimum: 1 })
  limit?: number;

  @ApiPropertyOptional({ type: 'integer', minimum: 1 })
  take?: number;
}
