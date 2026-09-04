import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityReview } from '../../entities/activity-review.entity';
import { assertReviewManager } from '../../helpers';
import { FindReviewById } from '../impl';

@QueryHandler(FindReviewById)
export class FindReviewByIdHandler implements IQueryHandler<FindReviewById, ActivityReview> {
  constructor(
    @InjectRepository(ActivityReview)
    private readonly repository: Repository<ActivityReview>
  ) {}

  async execute(query: FindReviewById): Promise<ActivityReview> {
    const review = await this.repository.findOne({
      where: { id: query.id },
      relations: { activity: { program: true }, user: true }
    });

    if (!review) throw new NotFoundException('Avis introuvable');

    if (review.userId !== query.actor.id) await assertReviewManager(this.repository, query.id, query.actor);

    return review;
  }
}
