import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities';
import { FindMyReviews } from '../impl';

@QueryHandler(FindMyReviews)
export class FindMyReviewsHandler implements IQueryHandler<FindMyReviews, [Review[], number]> {
  private readonly logger = new Logger(FindMyReviewsHandler.name);

  constructor(@InjectRepository(Review) private readonly repository: Repository<Review>) {}

  async execute(query: FindMyReviews): Promise<[Review[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.activity', 'activity')
        .where('review.reviewerId = :reviewerId', { reviewerId: query.reviewerId })
        .orderBy('review.updatedAt', 'DESC');

      if (query.params.activityId) {
        builder.andWhere('activity.id = :activityId', { activityId: query.params.activityId });
      }

      return await builder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Find my reviews failed reviewerId="${query.reviewerId}" params="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Évaluations introuvables');
    }
  }
}
