import { Query } from '@nestjs/cqrs';
import { Participation } from '../../entities';
import { IFilterParticipations } from '../../interfaces';

export class FindMyParticipations extends Query<[Participation[], number]> {
  constructor(
    public readonly participantId: string,
    public readonly params: IFilterParticipations = {}
  ) {
    super();
  }
}
