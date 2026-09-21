import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../../entities';
import { FindPortfolioBySlug } from '../impl';

@QueryHandler(FindPortfolioBySlug)
export class FindPortfolioBySlugHandler implements IQueryHandler<FindPortfolioBySlug, Portfolio> {
  private readonly logger = new Logger(FindPortfolioBySlugHandler.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>
  ) {}

  async execute(query: FindPortfolioBySlug): Promise<Portfolio> {
    try {
      return await this.repository.findOneByOrFail({ slug: query.slug });
    } catch (error) {
      this.logger.error(
        `Find portfolio by slug failed slug="${query.slug}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Portefeuille introuvable');
    }
  }
}
