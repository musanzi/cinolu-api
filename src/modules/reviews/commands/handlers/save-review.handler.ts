import { BadRequestException, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { isActivityOngoing } from '@/modules/activities/helpers';
import { FindActivityById } from '@/modules/activities/queries';
import { ActivityReview } from '../../entities/activity-review.entity';
import { SaveReview } from '../impl';

@CommandHandler(SaveReview)
export class SaveReviewHandler implements ICommandHandler<SaveReview, ActivityReview> {
  constructor(
    @InjectRepository(ActivityReview)
    private readonly repository: Repository<ActivityReview>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: SaveReview): Promise<ActivityReview> {
    const { actor, activityId, saveReviewDto } = command;
    const activity = await this.queryBus.execute(new FindActivityById(command.actor, activityId));

    if (!isActivityOngoing(activity)) throw new BadRequestException("Cette activité n'accepte pas d'avis");

    try {
      return await this.repository.save(
        this.repository.create({ activityId, userId: actor.id, ...saveReviewDto, submitDate: new Date() })
      );
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      )
        throw new ConflictException('Vous avez déjà évalué cette activité');

      throw new BadRequestException("Enregistrement de l'avis impossible");
    }
  }
}
