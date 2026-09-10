import { Command } from '@nestjs/cqrs';
import { CreateReviewDto } from '../../dto';
import { Review } from '../../entities';

export class CreateReview extends Command<Review> {
  constructor(
    public readonly reviewerId: string,
    public readonly dto: CreateReviewDto
  ) {
    super();
  }
}
