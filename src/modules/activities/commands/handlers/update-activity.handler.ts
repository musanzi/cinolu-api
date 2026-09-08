import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../entities';
import { FindActivityById } from '../../queries';
import { UpdateActivity } from '../impl';

@CommandHandler(UpdateActivity)
export class UpdateActivityHandler implements ICommandHandler<UpdateActivity, Activity> {
  private readonly logger = new Logger(UpdateActivityHandler.name);

  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateActivity): Promise<Activity> {
    try {
      const activity = await this.queryBus.execute(new FindActivityById(command.id));
      const dto = command.updateActivityDto;

      await this.repository.save({
        ...activity,
        ...dto,
        mentors: dto.mentorIds?.map((id) => ({ id })),
        types: dto.typeIds?.map((id) => ({ id })),
        categories: dto.categoryIds?.map((id) => ({ id }))
      });

      return await this.queryBus.execute(new FindActivityById(activity.id));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;

      this.logger.error(
        `Update activity failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Modification de l'activité impossible");
    }
  }
}
