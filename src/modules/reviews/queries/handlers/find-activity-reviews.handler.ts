import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindManagedActivityById } from '@/modules/activities/queries';
import { parsePaginationParams } from '@/shared/helpers';
import { ActivityReview } from '../../entities/activity-review.entity';
import { FindActivityReviews } from '../impl';

@QueryHandler(FindActivityReviews)
export class FindActivityReviewsHandler implements IQueryHandler<FindActivityReviews, [ActivityReview[], number]> {
  constructor(
    @InjectRepository(ActivityReview)
    private readonly repository: Repository<ActivityReview>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(query: FindActivityReviews): Promise<[ActivityReview[], number]> {
    await this.queryBus.execute(new FindManagedActivityById(query.actor, query.activityId));

    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.activityId = :activityId', { activityId: query.activityId })
      .orderBy('review.submitDate', 'DESC');

    if (query.params.q) builder.andWhere('(user.name ILIKE :q OR user.email ILIKE :q)', { q: `%${query.params.q}%` });

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
