import { IsStringRecord } from '../helpers';
import { ParticipationData } from '../interfaces';

export class UpdateParticipationDto {
  @IsStringRecord()
  data: ParticipationData;
}
