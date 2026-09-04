import { Command } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { SaveReviewDto } from '../../dto';
import { ActivityReview } from '../../entities/activity-review.entity';
export class SaveReview extends Command<ActivityReview> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly activityId: string,
    public readonly saveReviewDto: SaveReviewDto
  ) {
    super();
  }
}
