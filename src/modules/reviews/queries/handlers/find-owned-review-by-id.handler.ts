import { BadRequestException, ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { Review } from '../../entities';
import { FindOwnedReviewById, FindReviewById } from '../impl';

@QueryHandler(FindOwnedReviewById)
export class FindOwnedReviewByIdHandler implements IQueryHandler<FindOwnedReviewById, Review> {
  private readonly logger = new Logger(FindOwnedReviewByIdHandler.name);

  constructor(private readonly queryBus: QueryBus) {}

  async execute(query: FindOwnedReviewById): Promise<Review> {
    try {
      const review = await this.queryBus.execute<FindReviewById, Review>(new FindReviewById(query.id));

      if (review.reviewer.id !== query.reviewerId) {
        throw new ForbiddenException('Vous ne pouvez gérer que vos évaluations');
      }

      return review;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) throw error;

      this.logger.error(
        `Find owned review by id failed id="${query.id}" reviewerId="${query.reviewerId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Recherche de l'évaluation impossible");
    }
  }
}
