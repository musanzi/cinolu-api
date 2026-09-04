import { Command } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { UpdateParticipationStatusDto } from '../../dto';
import { ActivityParticipation } from '../../entities/activity-participation.entity';

export class UpdateParticipationStatus extends Command<ActivityParticipation> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly id: string,
    public readonly updateParticipationStatusDto: UpdateParticipationStatusDto
  ) {
    super();
  }
}
