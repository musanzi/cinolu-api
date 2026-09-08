import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { Repository } from 'typeorm';
import { Activity } from '../../entities';
import { FindActivityById } from '../../queries';
import { DeleteActivity } from '../impl';

@CommandHandler(DeleteActivity)
export class DeleteActivityHandler implements ICommandHandler<DeleteActivity, void> {
  private readonly logger = new Logger(DeleteActivityHandler.name);

  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteActivity): Promise<void> {
    try {
      const activity = await this.queryBus.execute(new FindActivityById(command.id));

      await this.repository.softDelete(activity.id);

      if (activity.cover) await promises.rm(`./uploads/activities/${activity.cover}`, { force: true });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Delete activity failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Suppression de l'activité impossible");
    }
  }
}
