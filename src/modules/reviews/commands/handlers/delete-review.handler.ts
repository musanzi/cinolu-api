import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityReview } from '../../entities/activity-review.entity';
import { FindReviewById } from '../../queries';
import { DeleteReview } from '../impl';

@CommandHandler(DeleteReview)
export class DeleteReviewHandler implements ICommandHandler<DeleteReview, void> {
  constructor(
    @InjectRepository(ActivityReview)
    private readonly repository: Repository<ActivityReview>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteReview): Promise<void> {
    await this.queryBus.execute(new FindReviewById(command.actor, command.id));

    await this.repository.softDelete(command.id);
  }
}
