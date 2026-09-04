import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../../entities/portfolio.entity';
import { FindPortfolioById } from '../impl';

@QueryHandler(FindPortfolioById)
export class FindPortfolioByIdHandler implements IQueryHandler<FindPortfolioById, Portfolio> {
  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>
  ) {}

  async execute(query: FindPortfolioById): Promise<Portfolio> {
    const portfolio = await this.repository.findOne({ where: { id: query.id }, relations: { programs: true } });

    if (!portfolio) throw new NotFoundException('Portefeuille introuvable');

    return portfolio;
  }
}
