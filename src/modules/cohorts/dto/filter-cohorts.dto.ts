import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterCohortsDto {
  @ApiPropertyOptional({ description: 'Filter by the ID of the parent program', format: 'uuid' })
  programId?: string;

  @ApiPropertyOptional({ description: 'Page number', type: 'integer' })
  page?: number | string;

  @ApiPropertyOptional({ description: 'Number of cohorts per page', type: 'integer' })
  limit?: number | string;
}
