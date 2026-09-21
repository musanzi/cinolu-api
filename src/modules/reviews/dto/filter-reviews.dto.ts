import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterReviewsDto {
  @ApiPropertyOptional({ description: 'Filter reviews by activity ID', format: 'uuid' })
  activityId?: string;

  @ApiPropertyOptional({ description: 'Page number', type: 'integer' })
  page?: number | string;

  @ApiPropertyOptional({ description: 'Number of reviews per page', type: 'integer' })
  limit?: number | string;

  @ApiPropertyOptional({ description: 'Alias of limit', type: 'integer' })
  take?: number | string;
}
