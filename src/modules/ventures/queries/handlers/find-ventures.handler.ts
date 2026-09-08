import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venture } from '../../entities';
import { FindVentures } from '../impl';

@QueryHandler(FindVentures)
export class FindVenturesHandler implements IQueryHandler<FindVentures, [Venture[], number]> {
  private readonly logger = new Logger(FindVenturesHandler.name);

  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  async execute(query: FindVentures): Promise<[Venture[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository
        .createQueryBuilder('venture')
        .leftJoinAndSelect('venture.sectors', 'sector')
        .leftJoinAndSelect('venture.owner', 'owner')
        .orderBy('venture.updatedAt', 'DESC');
      if (query.params.q) {
        builder.andWhere('(venture.name ILIKE :q OR owner.name ILIKE :q OR owner.email ILIKE :q)', {
          q: `%${query.params.q}%`
        });
      }
      if (query.params.status) builder.andWhere('venture.status = :status', { status: query.params.status });
      if (query.params.stage) builder.andWhere('venture.stage = :stage', { stage: query.params.stage });
      if (query.params.sectorId) builder.andWhere('sector.id = :sectorId', { sectorId: query.params.sectorId });
      return await builder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Find ventures failed params="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Initiatives introuvables');
    }
  }
}
