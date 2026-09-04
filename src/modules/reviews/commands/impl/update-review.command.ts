import { Command } from '@nestjs/cqrs';
import { SaveReviewDto } from '../../dto';
import { ActivityReview } from '../../entities/activity-review.entity';
export class UpdateReview extends Command<ActivityReview> {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly saveReviewDto: SaveReviewDto
  ) {
    super();
  }
}
