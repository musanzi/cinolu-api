import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindManagedActivityById } from '@/modules/activities/queries';
import { ActivityReview } from '../../entities/activity-review.entity';
import { calculateQuestionStatistics } from '../../helpers';
import { IReviewStatistics } from '../../interfaces';
import { GetReviewStatistics } from '../impl';

@QueryHandler(GetReviewStatistics)
export class GetReviewStatisticsHandler implements IQueryHandler<GetReviewStatistics, IReviewStatistics> {
  constructor(
    @InjectRepository(ActivityReview)
    private readonly repository: Repository<ActivityReview>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(query: GetReviewStatistics): Promise<IReviewStatistics> {
    await this.queryBus.execute(new FindManagedActivityById(query.actor, query.activityId));

    const reviews = await this.repository.find({
      where: { activityId: query.activityId },
      order: { submitDate: 'ASC' }
    });

    return {
      totalReviews: reviews.length,
      firstSubmitDate: reviews.at(0)?.submitDate ?? null,
      lastSubmitDate: reviews.at(-1)?.submitDate ?? null,
      questions: calculateQuestionStatistics(reviews.map((review) => review.responses))
    };
  }
}
