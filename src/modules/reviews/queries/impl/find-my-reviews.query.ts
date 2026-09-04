import { Query } from '@nestjs/cqrs';
import { ActivityReview } from '../../entities/activity-review.entity';
import { IFilterReviews } from '../../interfaces';
export class FindMyReviews extends Query<[ActivityReview[], number]> {
  constructor(
    public readonly userId: string,
    public readonly params: IFilterReviews
  ) {
    super();
  }
}
