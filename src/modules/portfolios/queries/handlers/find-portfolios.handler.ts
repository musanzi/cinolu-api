import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../../entities';
import { FindPortfolios } from '../impl';

@QueryHandler(FindPortfolios)
export class FindPortfoliosHandler implements IQueryHandler<FindPortfolios, [Portfolio[], number]> {
  private readonly logger = new Logger(FindPortfoliosHandler.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>
  ) {}

  async execute(query: FindPortfolios): Promise<[Portfolio[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository.createQueryBuilder('portfolio').orderBy('portfolio.updatedAt', 'DESC');

      if (query.params.q) builder.where('portfolio.name ILIKE :q', { q: `%${query.params.q}%` });

      return await builder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Find portfolios failed params="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Portefeuilles introuvables');
    }
  }
}
