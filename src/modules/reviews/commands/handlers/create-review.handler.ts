import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities';
import { FindReviewById } from '../../queries';
import { CreateReview } from '../impl';

@CommandHandler(CreateReview)
export class CreateReviewHandler implements ICommandHandler<CreateReview, Review> {
  private readonly logger = new Logger(CreateReviewHandler.name);

  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: CreateReview): Promise<Review> {
    const { reviewerId, dto } = command;

    try {
      const created = await this.repository.save({
        reviewer: { id: reviewerId },
        activity: { id: dto.activityId },
        data: dto.data
      });

      return await this.queryBus.execute<FindReviewById, Review>(new FindReviewById(created.id));
    } catch (error) {
      this.logger.error(
        `Create review failed reviewerId="${reviewerId}" activityId="${dto.activityId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Création de l'évaluation impossible");
    }
  }
}
