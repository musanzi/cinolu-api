import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { FindManagedProgramById } from '@/modules/programs/queries';
import { Activity } from '../../../entities/activity.entity';
import { ActivityCategory } from '../../../entities/activity-category.entity';
import { mapActivityCategories } from '../../../helpers';
import { CountActivityCategoriesByIds, FindActivityTypeById } from '../../../queries';
import { UpdateActivity } from '../../impl';

@CommandHandler(UpdateActivity)
export class UpdateActivityHandler implements ICommandHandler<UpdateActivity, Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateActivity): Promise<Activity> {
    const { updateActivityDto } = command;
    const { programId, name, typeId, categoryIds, startDate, endDate, participationForm, reviewForm, description } =
      updateActivityDto;
    const activity = await this.repository.findOne({ where: { id: command.id }, relations: { categories: true } });

    if (!activity) throw new NotFoundException('Activité introuvable');

    await this.queryBus.execute(new FindManagedProgramById(command.actor, activity.programId));

    if (activity.startDate <= new Date())
      throw new BadRequestException('Une activité ayant déjà commencé ne peut pas être modifiée');

    if (programId !== undefined) {
      await this.queryBus.execute(new FindManagedProgramById(command.actor, programId));
      activity.programId = programId;
    }

    if (typeId !== undefined) {
      await this.queryBus.execute(new FindActivityTypeById(typeId));
      activity.typeId = typeId;
    }

    if (categoryIds !== undefined) {
      if (categoryIds.length) {
        const count = await this.queryBus.execute(new CountActivityCategoriesByIds(categoryIds));
        if (count !== new Set(categoryIds).size)
          throw new BadRequestException('Une ou plusieurs catégories sont introuvables');
      }
      activity.categories = mapActivityCategories(categoryIds) as ActivityCategory[];
    }

    if (name !== undefined) {
      activity.name = name;
    }

    if (description !== undefined) activity.description = description;
    if (startDate !== undefined) activity.startDate = startDate;
    if (endDate !== undefined) activity.endDate = endDate;

    if (activity.endDate <= activity.startDate)
      throw new BadRequestException('La date de fin doit être postérieure à la date de début');

    if (participationForm !== undefined) activity.participationForm = participationForm;
    if (reviewForm !== undefined) activity.reviewForm = reviewForm;

    try {
      return await this.repository.save(activity);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      )
        throw new ConflictException('Une activité avec ce nom existe déjà');

      throw new BadRequestException("Modification de l'activité impossible");
    }
  }
}
