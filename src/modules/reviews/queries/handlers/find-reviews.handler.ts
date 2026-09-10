import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities';
import { FindReviews } from '../impl';

@QueryHandler(FindReviews)
export class FindReviewsHandler implements IQueryHandler<FindReviews, [Review[], number]> {
  private readonly logger = new Logger(FindReviewsHandler.name);

  constructor(@InjectRepository(Review) private readonly repository: Repository<Review>) {}

  async execute(query: FindReviews): Promise<[Review[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.reviewer', 'reviewer')
        .leftJoinAndSelect('review.activity', 'activity')
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
        `Find reviews failed params="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Évaluations introuvables');
    }
  }
}
