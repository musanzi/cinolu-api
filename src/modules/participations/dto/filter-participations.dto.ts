import { ApiPropertyOptional } from '@nestjs/swagger';
import { ParticipationStatus } from '../interfaces';

export class FilterParticipationsDto {
  @ApiPropertyOptional({ description: 'Filter by activity id', format: 'uuid' })
  activityId?: string;

  @ApiPropertyOptional({ enum: ParticipationStatus, description: 'Filter by participation status' })
  status?: ParticipationStatus;

  @ApiPropertyOptional({ description: 'Page number', type: 'integer' })
  page?: number | string;

  @ApiPropertyOptional({ description: 'Number of participations per page', type: 'integer' })
  limit?: number | string;

  @ApiPropertyOptional({ description: 'Alias of limit', type: 'integer' })
  take?: number | string;
}
