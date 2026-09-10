import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from '../../entities';
import { FindParticipationById } from '../impl';

@QueryHandler(FindParticipationById)
export class FindParticipationByIdHandler implements IQueryHandler<FindParticipationById, Participation> {
  private readonly logger = new Logger(FindParticipationByIdHandler.name);

  constructor(@InjectRepository(Participation) private readonly repository: Repository<Participation>) {}

  async execute(query: FindParticipationById): Promise<Participation> {
    try {
      return await this.repository.findOneOrFail({
        where: { id: query.id },
        relations: { participant: true, activity: true }
      });
    } catch (error) {
      this.logger.error(
        `Find participation by id failed id="${query.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Participation introuvable');
    }
  }
}
