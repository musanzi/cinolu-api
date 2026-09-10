import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities';
import { FindReviewByReviewerAndActivity } from '../impl';

@QueryHandler(FindReviewByReviewerAndActivity)
export class FindReviewByReviewerAndActivityHandler implements IQueryHandler<
  FindReviewByReviewerAndActivity,
  Review | null
> {
  private readonly logger = new Logger(FindReviewByReviewerAndActivityHandler.name);

  constructor(@InjectRepository(Review) private readonly repository: Repository<Review>) {}

  async execute(query: FindReviewByReviewerAndActivity): Promise<Review | null> {
    try {
      return await this.repository.findOne({
        where: {
          reviewer: { id: query.reviewerId },
          activity: { id: query.activityId }
        },
        relations: { reviewer: true, activity: true }
      });
    } catch (error) {
      this.logger.error(
        `Find review by reviewer and activity failed reviewerId="${query.reviewerId}" activityId="${query.activityId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Recherche de l'évaluation impossible");
    }
  }
}
