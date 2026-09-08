import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../../entities';
import { FindPortfolioById } from '../impl';

@QueryHandler(FindPortfolioById)
export class FindPortfolioByIdHandler implements IQueryHandler<FindPortfolioById, Portfolio> {
  private readonly logger = new Logger(FindPortfolioByIdHandler.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>
  ) {}

  async execute(query: FindPortfolioById): Promise<Portfolio> {
    try {
      return await this.repository.findOneByOrFail({ id: query.id });
    } catch (error) {
      this.logger.error(
        `Find portfolio by id failed id="${query.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Portefeuille introuvable');
    }
  }
}
