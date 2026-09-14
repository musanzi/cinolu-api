import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities';
import { FindReviewById } from '../../queries';
import { UpdateReview } from '../impl';

@CommandHandler(UpdateReview)
export class UpdateReviewHandler implements ICommandHandler<UpdateReview, Review> {
  private readonly logger = new Logger(UpdateReviewHandler.name);

  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateReview): Promise<Review> {
    try {
      await this.repository.update(command.id, { data: command.dto.data });

      return await this.queryBus.execute(new FindReviewById(command.id));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Update review failed id="${command.id}" reviewerId="${command.reviewerId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Modification de l'évaluation impossible");
    }
  }
}
