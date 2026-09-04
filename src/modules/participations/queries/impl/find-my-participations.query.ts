import { Query } from '@nestjs/cqrs';
import { ActivityParticipation } from '../../entities/activity-participation.entity';
import { IFilterParticipations } from '../../interfaces';
export class FindMyParticipations extends Query<[ActivityParticipation[], number]> {
  constructor(
    public readonly userId: string,
    public readonly params: IFilterParticipations
  ) {
    super();
  }
}
