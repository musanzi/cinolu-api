import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityReview } from '../../entities/activity-review.entity';
import { UpdateReview } from '../impl';

@CommandHandler(UpdateReview)
export class UpdateReviewHandler implements ICommandHandler<UpdateReview, ActivityReview> {
  constructor(
    @InjectRepository(ActivityReview)
    private readonly repository: Repository<ActivityReview>
  ) {}

  async execute(command: UpdateReview): Promise<ActivityReview> {
    const { userId, id, saveReviewDto } = command;
    const review = await this.repository.findOneBy({ id });

    if (!review) throw new NotFoundException('Avis introuvable');
    if (review.userId !== userId) throw new ForbiddenException('Vous ne pouvez modifier que votre avis');

    return this.repository.save(this.repository.merge(review, saveReviewDto, { submitDate: new Date() }));
  }
}
