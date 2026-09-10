import { Query } from '@nestjs/cqrs';
import { Review } from '../../entities';

export class FindOwnedReviewById extends Query<Review> {
  constructor(
    public readonly id: string,
    public readonly reviewerId: string
  ) {
    super();
  }
}
