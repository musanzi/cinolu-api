import { BadRequestException, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { FindManagedProgramById } from '@/modules/programs/queries';
import { Activity } from '../../../entities/activity.entity';
import { mapActivityCategories } from '../../../helpers';
import { CountActivityCategoriesByIds, FindActivityTypeById } from '../../../queries';
import { CreateActivity } from '../../impl';

@CommandHandler(CreateActivity)
export class CreateActivityHandler implements ICommandHandler<CreateActivity, Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: CreateActivity): Promise<Activity> {
    const { programId, typeId, categoryIds, startDate, endDate } = command.createActivityDto;

    await this.queryBus.execute(new FindManagedProgramById(command.actor, programId));

    await this.queryBus.execute(new FindActivityTypeById(typeId));
    if (endDate <= startDate) throw new BadRequestException('La date de fin doit être postérieure à la date de début');

    if (categoryIds.length) {
      const count = await this.queryBus.execute(new CountActivityCategoriesByIds(categoryIds));
      if (count !== new Set(categoryIds).size)
        throw new BadRequestException('Une ou plusieurs catégories sont introuvables');
    }

    try {
      const activityFields = { ...command.createActivityDto };

      delete activityFields.categoryIds;

      return await this.repository.save(
        this.repository.create({
          ...activityFields,
          categories: mapActivityCategories(categoryIds)
        })
      );
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      ) {
        throw new ConflictException('Une activité avec ce nom existe déjà');
      }

      throw new BadRequestException("Création de l'activité impossible");
    }
  }
}
