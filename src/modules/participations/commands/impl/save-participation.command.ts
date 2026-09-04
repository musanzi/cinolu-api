import { Command } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { SaveParticipationDto } from '../../dto';
import { ActivityParticipation } from '../../entities/activity-participation.entity';

export class SaveParticipation extends Command<ActivityParticipation> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly activityId: string,
    public readonly saveParticipationDto: SaveParticipationDto
  ) {
    super();
  }
}
