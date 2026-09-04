import { BadRequestException, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ActivityType } from '../../../entities';
import { CreateActivityType } from '../../impl';

@CommandHandler(CreateActivityType)
export class CreateActivityTypeHandler implements ICommandHandler<CreateActivityType, ActivityType> {
  constructor(
    @InjectRepository(ActivityType)
    private readonly repository: Repository<ActivityType>
  ) {}

  async execute(command: CreateActivityType): Promise<ActivityType> {
    try {
      return await this.repository.save(this.repository.create(command.createActivityTypeDto));
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      ) {
        throw new ConflictException("Un type d'activité avec ce nom existe déjà");
      }

      throw new BadRequestException("Création du type d'activité impossible");
    }
  }
}
