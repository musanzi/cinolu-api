import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterCategoriesDto {
  @ApiPropertyOptional({ description: 'Search categories by name (case-insensitive partial match)' })
  q?: string;

  @ApiPropertyOptional({ description: 'Page number', type: 'integer' })
  page?: number | string;

  @ApiPropertyOptional({ description: 'Number of items per page', type: 'integer' })
  limit?: number | string;

  @ApiPropertyOptional({ description: 'Number of items to take', type: 'integer' })
  take?: number | string;
}
