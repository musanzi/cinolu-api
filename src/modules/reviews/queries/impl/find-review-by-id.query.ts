import { Query } from '@nestjs/cqrs';
import { Review } from '../../entities';

export class FindReviewById extends Query<Review> {
  constructor(public readonly id: string) {
    super();
  }
}
