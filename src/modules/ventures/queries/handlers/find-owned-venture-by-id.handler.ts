import { BadRequestException, ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { Venture } from '../../entities';
import { FindOwnedVentureById, FindVentureById } from '../impl';

@QueryHandler(FindOwnedVentureById)
export class FindOwnedVentureByIdHandler implements IQueryHandler<FindOwnedVentureById, Venture> {
  private readonly logger = new Logger(FindOwnedVentureByIdHandler.name);

  constructor(private readonly queryBus: QueryBus) {}

  async execute(query: FindOwnedVentureById): Promise<Venture> {
    try {
      const venture = await this.queryBus.execute<FindVentureById, Venture>(new FindVentureById(query.id));
      if (venture.owner.id !== query.ownerId) {
        throw new ForbiddenException('Vous ne pouvez gérer que vos initiatives');
      }
      return venture;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) throw error;

      this.logger.error(
        `Find owned venture by id failed id="${query.id}" ownerId="${query.ownerId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Recherche de l'initiative impossible");
    }
  }
}
