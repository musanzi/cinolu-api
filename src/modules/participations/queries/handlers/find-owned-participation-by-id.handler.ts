import { BadRequestException, ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { Participation } from '../../entities';
import { FindOwnedParticipationById, FindParticipationById } from '../impl';

@QueryHandler(FindOwnedParticipationById)
export class FindOwnedParticipationByIdHandler implements IQueryHandler<FindOwnedParticipationById, Participation> {
  private readonly logger = new Logger(FindOwnedParticipationByIdHandler.name);

  constructor(private readonly queryBus: QueryBus) {}

  async execute(query: FindOwnedParticipationById): Promise<Participation> {
    try {
      const participation = await this.queryBus.execute<FindParticipationById, Participation>(
        new FindParticipationById(query.id)
      );

      if (participation.participant.id !== query.participantId) {
        throw new ForbiddenException('Vous ne pouvez gérer que vos participations');
      }

      return participation;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) throw error;

      this.logger.error(
        `Find owned participation by id failed id="${query.id}" participantId="${query.participantId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Recherche de la participation impossible');
    }
  }
}
