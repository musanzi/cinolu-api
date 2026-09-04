import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { Activity } from '../../../entities/activity.entity';
import { IFilterActivities } from '../../../interfaces';
export class FindActivities extends Query<[Activity[], number]> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly params: IFilterActivities
  ) {
    super();
  }
}
