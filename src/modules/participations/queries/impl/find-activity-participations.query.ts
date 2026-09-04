import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { ActivityParticipation } from '../../entities/activity-participation.entity';
import { IFilterParticipations } from '../../interfaces';
export class FindActivityParticipations extends Query<[ActivityParticipation[], number]> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly activityId: string,
    public readonly params: IFilterParticipations
  ) {
    super();
  }
}
