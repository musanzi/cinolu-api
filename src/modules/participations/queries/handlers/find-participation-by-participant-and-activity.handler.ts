import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from '../../entities';
import { FindParticipationByParticipantAndActivity } from '../impl';

@QueryHandler(FindParticipationByParticipantAndActivity)
export class FindParticipationByParticipantAndActivityHandler implements IQueryHandler<
  FindParticipationByParticipantAndActivity,
  Participation | null
> {
  private readonly logger = new Logger(FindParticipationByParticipantAndActivityHandler.name);

  constructor(@InjectRepository(Participation) private readonly repository: Repository<Participation>) {}

  async execute(query: FindParticipationByParticipantAndActivity): Promise<Participation | null> {
    try {
      return await this.repository.findOne({
        where: {
          participant: { id: query.participantId },
          activity: { id: query.activityId }
        },
        relations: { participant: true, activity: true }
      });
    } catch (error) {
      this.logger.error(
        `Find participation by participant and activity failed participantId="${query.participantId}" activityId="${query.activityId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Recherche de la participation impossible');
    }
  }
}
