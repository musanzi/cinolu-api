import { IsJSON, IsUUID } from 'class-validator';
import { ParticipationData } from '../interfaces';

export class CreateParticipationDto {
  @IsUUID('4')
  activityId: string;

  @IsJSON()
  data: ParticipationData;
}
