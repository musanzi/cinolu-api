import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterProgramsDto {
  @ApiPropertyOptional({ description: 'Search programs by name' })
  q?: string;

  @ApiPropertyOptional({ description: 'Filter by portfolio ID', format: 'uuid' })
  portfolioId?: string;

  @ApiPropertyOptional({ description: 'Filter by manager ID', format: 'uuid' })
  managerId?: string;

  @ApiPropertyOptional({ description: 'Page number', type: 'integer' })
  page?: number | string;

  @ApiPropertyOptional({ description: 'Number of programs per page', type: 'integer' })
  limit?: number | string;

  @ApiPropertyOptional({ description: 'Alias of limit', type: 'integer' })
  take?: number | string;
}
