import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities';
import { FindReviewById } from '../impl';

@QueryHandler(FindReviewById)
export class FindReviewByIdHandler implements IQueryHandler<FindReviewById, Review> {
  private readonly logger = new Logger(FindReviewByIdHandler.name);

  constructor(@InjectRepository(Review) private readonly repository: Repository<Review>) {}

  async execute(query: FindReviewById): Promise<Review> {
    try {
      return await this.repository.findOneOrFail({
        where: { id: query.id },
        relations: { reviewer: true, activity: true }
      });
    } catch (error) {
      this.logger.error(
        `Find review by id failed id="${query.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Évaluation introuvable');
    }
  }
}
