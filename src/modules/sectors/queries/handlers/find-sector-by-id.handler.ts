import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from '../../entities';
import { FindSectorById } from '../impl';

@QueryHandler(FindSectorById)
export class FindSectorByIdHandler implements IQueryHandler<FindSectorById, Sector> {
  private readonly logger = new Logger(FindSectorByIdHandler.name);

  constructor(@InjectRepository(Sector) private readonly repository: Repository<Sector>) {}

  async execute(query: FindSectorById): Promise<Sector> {
    try {
      return await this.repository.findOneByOrFail({ id: query.id });
    } catch (error) {
      this.logger.error(
        `Find sector by id failed id="${query.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Secteur introuvable');
    }
  }
}
