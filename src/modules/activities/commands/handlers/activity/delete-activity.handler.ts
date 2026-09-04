import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../../entities/activity.entity';
import { FindManagedActivityById } from '../../../queries';
import { DeleteActivity } from '../../impl';

@CommandHandler(DeleteActivity)
export class DeleteActivityHandler implements ICommandHandler<DeleteActivity, void> {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteActivity): Promise<void> {
    await this.queryBus.execute(new FindManagedActivityById(command.actor, command.id));

    await this.repository.softDelete(command.id);
  }
}
