import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities';
import { IProgramAdminStatistics } from '../../interfaces';
import { GetProgramAdminStatistics } from '../impl';

interface IProgramCountRow {
  name: string;
  total: string;
}

@QueryHandler(GetProgramAdminStatistics)
export class GetProgramAdminStatisticsHandler implements IQueryHandler<
  GetProgramAdminStatistics,
  IProgramAdminStatistics
> {
  constructor(@InjectRepository(Program) private readonly repository: Repository<Program>) {}

  async execute(): Promise<IProgramAdminStatistics> {
    const [total, byPortfolio] = await Promise.all([
      this.repository.count(),
      this.repository
        .createQueryBuilder('program')
        .innerJoin('program.portfolio', 'portfolio')
        .select('portfolio.name', 'name')
        .addSelect('COUNT(program.id)', 'total')
        .groupBy('portfolio.id')
        .addGroupBy('portfolio.name')
        .orderBy('COUNT(program.id)', 'DESC')
        .getRawMany<IProgramCountRow>()
    ]);

    return {
      total,
      byPortfolio: byPortfolio.map((item) => ({ name: item.name, total: Number(item.total) }))
    };
  }
}
