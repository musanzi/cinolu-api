import { Query } from '@nestjs/cqrs';
import { Review } from '../../entities';

export class FindReviewByReviewerAndActivity extends Query<Review | null> {
  constructor(
    public readonly reviewerId: string,
    public readonly activityId: string
  ) {
    super();
  }
}
