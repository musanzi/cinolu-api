import { FindActivityById } from '@/modules/activities/queries';
import { BadRequestException, ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Participation } from '../../entities';
import { FindParticipationById, FindParticipationByParticipantAndActivity } from '../../queries';
import { CreateParticipation } from '../impl';

@CommandHandler(CreateParticipation)
export class CreateParticipationHandler implements ICommandHandler<CreateParticipation, Participation> {
  private readonly logger = new Logger(CreateParticipationHandler.name);

  constructor(
    @InjectRepository(Participation)
    private readonly repository: Repository<Participation>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: CreateParticipation): Promise<Participation> {
    const { participantId, dto } = command;

    try {
      const activity = await this.queryBus.execute(new FindActivityById(dto.activityId));

      if (!activity.isPublished) {
        throw new BadRequestException("Cette activité n'est pas ouverte aux participations");
      }
      if (activity.startDate <= new Date()) {
        throw new BadRequestException('La période de participation à cette activité est terminée');
      }

      const existing = await this.queryBus.execute(
        new FindParticipationByParticipantAndActivity(participantId, dto.activityId)
      );
      if (existing) {
        throw new ConflictException('Vous participez déjà à cette activité');
      }

      const created = await this.repository.save({
        participant: { id: participantId },
        activity: { id: dto.activityId },
        data: dto.data
      });

      return await this.queryBus.execute<FindParticipationById, Participation>(new FindParticipationById(created.id));
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new ConflictException('Vous participez déjà à cette activité');
      }
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      this.logger.error(
        `Create participation failed participantId="${participantId}" activityId="${dto.activityId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Création de la participation impossible');
    }
  }
}
