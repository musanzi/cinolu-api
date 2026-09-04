import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { ActivityParticipation } from '../../entities/activity-participation.entity';
export class FindParticipationById extends Query<ActivityParticipation> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly id: string
  ) {
    super();
  }
}
