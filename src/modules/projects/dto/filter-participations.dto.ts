import { PaginationQuery } from '@/core/types/pagination.query';
import { IsEnum, IsOptional } from 'class-validator';
import { ProjectParticipationStatus } from '../types/project-participation-status.enum';

export class FilterParticipationsDto extends PaginationQuery {
  @IsOptional()
  phaseId?: string;

  @IsOptional()
  @IsEnum(ProjectParticipationStatus)
  status?: ProjectParticipationStatus;
}
