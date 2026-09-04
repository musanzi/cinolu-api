import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { ActivityReview } from '../../entities/activity-review.entity';
export class FindReviewById extends Query<ActivityReview> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly id: string
  ) {
    super();
  }
}
