import { Command } from '@nestjs/cqrs';
import { SaveParticipationDto } from '../../dto';
import { ActivityParticipation } from '../../entities/activity-participation.entity';

export class UpdateParticipation extends Command<ActivityParticipation> {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly saveParticipationDto: SaveParticipationDto
  ) {
    super();
  }
}
