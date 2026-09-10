import { Command } from '@nestjs/cqrs';
import { CreateParticipationDto } from '../../dto';
import { Participation } from '../../entities';

export class CreateParticipation extends Command<Participation> {
  constructor(
    public readonly participantId: string,
    public readonly dto: CreateParticipationDto
  ) {
    super();
  }
}
