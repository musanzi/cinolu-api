import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities';
import { FindPrograms } from '../impl';

@QueryHandler(FindPrograms)
export class FindProgramsHandler implements IQueryHandler<FindPrograms, [Program[], number]> {
  private readonly logger = new Logger(FindProgramsHandler.name);

  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>
  ) {}

  async execute(query: FindPrograms): Promise<[Program[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository
        .createQueryBuilder('program')
        .leftJoinAndSelect('program.portfolio', 'portfolio')
        .leftJoinAndSelect('program.managers', 'managers')
        .orderBy('program.updatedAt', 'DESC')
        .distinct(true);

      if (query.params.q) builder.andWhere('program.name ILIKE :q', { q: `%${query.params.q}%` });
      if (query.params.portfolioId) {
        builder.andWhere('program.portfolioId = :portfolioId', { portfolioId: query.params.portfolioId });
      }
      if (query.params.managerId) {
        builder.innerJoin('program.managers', 'filteredManager', 'filteredManager.id = :managerId', {
          managerId: query.params.managerId
        });
      }

      return await builder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Find programs failed params="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Programmes introuvables');
    }
  }
}
