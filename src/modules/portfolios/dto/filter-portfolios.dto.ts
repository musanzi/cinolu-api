import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterPortfoliosDto {
  @ApiPropertyOptional({ description: 'Search portfolios by name (case-insensitive partial match)' })
  q?: string;

  @ApiPropertyOptional({ description: 'Page number', type: 'integer' })
  page?: number | string;

  @ApiPropertyOptional({ description: 'Number of portfolios per page', type: 'integer' })
  limit?: number | string;

  @ApiPropertyOptional({ description: 'Number of portfolios to take', type: 'integer' })
  take?: number | string;
}
