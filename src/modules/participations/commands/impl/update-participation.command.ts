import { Command } from '@nestjs/cqrs';
import { UpdateParticipationDto } from '../../dto';
import { Participation } from '../../entities';

export class UpdateParticipation extends Command<Participation> {
  constructor(
    public readonly participantId: string,
    public readonly id: string,
    public readonly dto: UpdateParticipationDto
  ) {
    super();
  }
}
