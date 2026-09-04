import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ActivityType } from '../../../entities';
import { FindActivityTypeById } from '../../../queries';
import { UpdateActivityType } from '../../impl';

@CommandHandler(UpdateActivityType)
export class UpdateActivityTypeHandler implements ICommandHandler<UpdateActivityType, ActivityType> {
  constructor(
    @InjectRepository(ActivityType)
    private readonly repository: Repository<ActivityType>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateActivityType): Promise<ActivityType> {
    try {
      const activityType = await this.queryBus.execute<FindActivityTypeById, ActivityType>(
        new FindActivityTypeById(command.id)
      );

      return await this.repository.save(this.repository.merge(activityType, command.updateActivityTypeDto));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      ) {
        throw new ConflictException("Un type d'activité avec ce nom existe déjà");
      }

      throw new BadRequestException("Modification du type d'activité impossible");
    }
  }
}
