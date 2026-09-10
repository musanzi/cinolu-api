import { IsJSON } from 'class-validator';
import { ParticipationData } from '../interfaces';

export class UpdateParticipationDto {
  @IsJSON()
  data: ParticipationData;
}
