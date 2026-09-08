import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../entities';
import { FindActivityById } from '../../queries';
import { ToggleActivityPublication } from '../impl';

@CommandHandler(ToggleActivityPublication)
export class ToggleActivityPublicationHandler implements ICommandHandler<ToggleActivityPublication, Activity> {
  private readonly logger = new Logger(ToggleActivityPublicationHandler.name);

  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: ToggleActivityPublication): Promise<Activity> {
    try {
      const activity = await this.queryBus.execute(new FindActivityById(command.id));

      await this.repository.update(activity.id, { isPublished: !activity.isPublished });

      return await this.queryBus.execute(new FindActivityById(activity.id));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Toggle activity publication failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Modification de la publication de l'activité impossible");
    }
  }
}
