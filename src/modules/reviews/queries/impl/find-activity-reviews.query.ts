import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { ActivityReview } from '../../entities/activity-review.entity';
import { IFilterReviews } from '../../interfaces';
export class FindActivityReviews extends Query<[ActivityReview[], number]> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly activityId: string,
    public readonly params: IFilterReviews
  ) {
    super();
  }
}
