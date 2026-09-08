import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from '../../entities';
import { FindSectors } from '../impl';

@QueryHandler(FindSectors)
export class FindSectorsHandler implements IQueryHandler<FindSectors, [Sector[], number]> {
  private readonly logger = new Logger(FindSectorsHandler.name);

  constructor(
    @InjectRepository(Sector)
    private readonly repository: Repository<Sector>
  ) {}

  async execute(query: FindSectors): Promise<[Sector[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository.createQueryBuilder('sector').orderBy('sector.name', 'ASC');
      if (query.params.q) builder.where('sector.name ILIKE :q', { q: `%${query.params.q}%` });
      return await builder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Find sectors failed params="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Secteurs introuvables');
    }
  }
}
