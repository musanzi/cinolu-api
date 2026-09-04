import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parsePaginationParams } from '@/shared/helpers';
import { ActivityReview } from '../../entities/activity-review.entity';
import { FindMyReviews } from '../impl';

@QueryHandler(FindMyReviews)
export class FindMyReviewsHandler implements IQueryHandler<FindMyReviews, [ActivityReview[], number]> {
  constructor(
    @InjectRepository(ActivityReview)
    private readonly repository: Repository<ActivityReview>
  ) {}

  execute(query: FindMyReviews): Promise<[ActivityReview[], number]> {
    const { pageNumber, limitNumber } = parsePaginationParams(query.params);

    return this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.activity', 'activity')
      .where('review.userId = :userId', { userId: query.userId })
      .orderBy('review.submitDate', 'DESC')
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
