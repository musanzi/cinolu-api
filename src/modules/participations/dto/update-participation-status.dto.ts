import { IsEnum } from 'class-validator';
import { ParticipationStatus } from '../interfaces';

export class UpdateParticipationStatusDto {
  @IsEnum(ParticipationStatus)
  status: ParticipationStatus;
}
