import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parsePaginationParams } from '@/shared/helpers';
import { Portfolio } from '../../entities/portfolio.entity';
import { FindPortfolios } from '../impl';

@QueryHandler(FindPortfolios)
export class FindPortfoliosHandler implements IQueryHandler<FindPortfolios, [Portfolio[], number]> {
  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>
  ) {}

  execute(query: FindPortfolios): Promise<[Portfolio[], number]> {
    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository.createQueryBuilder('portfolio').orderBy('portfolio.updatedAt', 'DESC');

    if (query.params.q) builder.where('portfolio.name ILIKE :q', { q: `%${query.params.q}%` });

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
