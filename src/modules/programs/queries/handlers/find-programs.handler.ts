import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parsePaginationParams } from '@/shared/helpers';
import { Program } from '../../entities/program.entity';
import { FindPrograms } from '../impl';

@QueryHandler(FindPrograms)
export class FindProgramsHandler implements IQueryHandler<FindPrograms, [Program[], number]> {
  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>
  ) {}

  execute(query: FindPrograms): Promise<[Program[], number]> {
    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository
      .createQueryBuilder('program')
      .leftJoinAndSelect('program.portfolio', 'portfolio')
      .leftJoinAndSelect('program.programManagers', 'manager')
      .orderBy('program.updatedAt', 'DESC');

    if (query.params.q) builder.andWhere('program.name ILIKE :q', { q: `%${query.params.q}%` });
    if (query.params.portfolioId)
      builder.andWhere('program.portfolioId = :portfolioId', { portfolioId: query.params.portfolioId });
    if (query.params.managerId) builder.andWhere('manager.id = :managerId', { managerId: query.params.managerId });

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
