import { Query } from '@nestjs/cqrs';
import { Participation } from '../../entities';

export class FindParticipationByParticipantAndActivity extends Query<Participation | null> {
  constructor(
    public readonly participantId: string,
    public readonly activityId: string
  ) {
    super();
  }
}
