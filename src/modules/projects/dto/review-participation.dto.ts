import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectParticipationStatus } from '../types/project-participation-status.enum';

export class ReviewParticipationDto {
  @IsEnum(ProjectParticipationStatus)
  status: ProjectParticipationStatus;

  @IsOptional()
  @IsString()
  review_message?: string;
}
