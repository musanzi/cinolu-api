import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterActivitiesDto {
  @ApiPropertyOptional({ description: 'Filter by the ID of the parent program', format: 'uuid' })
  programId?: string;

  @ApiPropertyOptional({ description: 'Filter by the slug of the parent program' })
  programSlug?: string;

  @ApiPropertyOptional({ description: 'Search activities by name' })
  q?: string;

  @ApiPropertyOptional({ description: 'Only activities starting on or after this date', format: 'date-time' })
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Only activities ending on or before this date', format: 'date-time' })
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Page number', type: 'integer' })
  page?: number | string;

  @ApiPropertyOptional({ description: 'Number of activities per page', type: 'integer' })
  limit?: number | string;

  @ApiPropertyOptional({ description: 'Alias of limit', type: 'integer' })
  take?: number | string;
}
