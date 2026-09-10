import { Query } from '@nestjs/cqrs';
import { Participation } from '../../entities';

export class FindOwnedParticipationById extends Query<Participation> {
  constructor(
    public readonly id: string,
    public readonly participantId: string
  ) {
    super();
  }
}
