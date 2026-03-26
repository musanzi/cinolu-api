import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectParticipationStatus } from '../types/project-participation-status.enum';

export class ReviewParticipationDto {
  @IsEnum(ProjectParticipationStatus)
  status: ProjectParticipationStatus;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsBoolean()
  move_to_next_phase?: boolean;
}
