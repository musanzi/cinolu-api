import { Command } from '@nestjs/cqrs';
import { UpdateParticipationStatusDto } from '../../dto';
import { Participation } from '../../entities';

export class UpdateParticipationStatus extends Command<Participation> {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateParticipationStatusDto
  ) {
    super();
  }
}
