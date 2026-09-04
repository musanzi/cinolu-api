import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { Activity } from '../../../entities/activity.entity';
export class FindActivityById extends Query<Activity> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly id: string
  ) {
    super();
  }
}
