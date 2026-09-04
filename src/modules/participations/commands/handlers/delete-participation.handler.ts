import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityParticipation } from '../../entities/activity-participation.entity';
import { FindParticipationById } from '../../queries';
import { DeleteParticipation } from '../impl';

@CommandHandler(DeleteParticipation)
export class DeleteParticipationHandler implements ICommandHandler<DeleteParticipation, void> {
  constructor(
    @InjectRepository(ActivityParticipation)
    private readonly repository: Repository<ActivityParticipation>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteParticipation): Promise<void> {
    await this.queryBus.execute(new FindParticipationById(command.actor, command.id));

    await this.repository.softDelete(command.id);
  }
}
