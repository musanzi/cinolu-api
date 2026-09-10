import { Query } from '@nestjs/cqrs';
import { Participation } from '../../entities';
import { IFilterParticipations } from '../../interfaces';

export class FindParticipations extends Query<[Participation[], number]> {
  constructor(public readonly params: IFilterParticipations = {}) {
    super();
  }
}
