import { Command } from '@nestjs/cqrs';
import { UpdateReviewDto } from '../../dto';
import { Review } from '../../entities';

export class UpdateReview extends Command<Review> {
  constructor(
    public readonly reviewerId: string,
    public readonly id: string,
    public readonly dto: UpdateReviewDto
  ) {
    super();
  }
}
