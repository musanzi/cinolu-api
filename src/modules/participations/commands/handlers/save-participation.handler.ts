import { BadRequestException, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { isActivityOngoing } from '@/modules/activities/helpers';
import { FindActivityById } from '@/modules/activities/queries';
import { ActivityParticipation } from '../../entities/activity-participation.entity';
import { SaveParticipation } from '../impl';

@CommandHandler(SaveParticipation)
export class SaveParticipationHandler implements ICommandHandler<SaveParticipation, ActivityParticipation> {
  constructor(
    @InjectRepository(ActivityParticipation)
    private readonly repository: Repository<ActivityParticipation>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: SaveParticipation): Promise<ActivityParticipation> {
    const { actor, activityId, saveParticipationDto } = command;
    const activity = await this.queryBus.execute(new FindActivityById(command.actor, activityId));

    if (!isActivityOngoing(activity)) throw new BadRequestException("Cette activité n'accepte pas de participations");

    try {
      return await this.repository.save(
        this.repository.create({
          activityId,
          userId: actor.id,
          ...saveParticipationDto,
          submitDate: new Date()
        })
      );
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      ) {
        throw new ConflictException('Vous participez déjà à cette activité');
      }

      throw new BadRequestException('Enregistrement de la participation impossible');
    }
  }
}
