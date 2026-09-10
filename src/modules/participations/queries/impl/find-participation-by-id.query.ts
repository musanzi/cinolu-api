import { Query } from '@nestjs/cqrs';
import { Participation } from '../../entities';

export class FindParticipationById extends Query<Participation> {
  constructor(public readonly id: string) {
    super();
  }
}
