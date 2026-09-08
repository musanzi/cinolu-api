import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { Repository } from 'typeorm';
import { Activity } from '../../entities';
import { FindActivityById } from '../../queries';
import { UploadActivityCover } from '../impl';

@CommandHandler(UploadActivityCover)
export class UploadActivityCoverHandler implements ICommandHandler<UploadActivityCover, Activity> {
  private readonly logger = new Logger(UploadActivityCoverHandler.name);

  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UploadActivityCover): Promise<Activity> {
    try {
      const activity = await this.queryBus.execute(new FindActivityById(command.activityId));

      await this.repository.update(activity.id, { cover: command.file.filename });

      if (activity.cover) await promises.rm(`./uploads/activities/${activity.cover}`, { force: true });

      return await this.queryBus.execute(new FindActivityById(activity.id));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Upload activity cover failed id="${command.activityId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Ajout de la couverture de l'activité impossible");
    }
  }
}
