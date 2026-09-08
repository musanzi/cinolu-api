import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities';
import { FindProgramsByPortfolioSlug } from '../impl';

@QueryHandler(FindProgramsByPortfolioSlug)
export class FindProgramsByPortfolioSlugHandler implements IQueryHandler<FindProgramsByPortfolioSlug, Program[]> {
  private readonly logger = new Logger(FindProgramsByPortfolioSlugHandler.name);

  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>
  ) {}

  async execute(query: FindProgramsByPortfolioSlug): Promise<Program[]> {
    try {
      return await this.repository.find({
        where: { portfolio: { slug: query.portfolioSlug } },
        relations: ['portfolio', 'managers'],
        order: { updatedAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(
        `Find programs by portfolio slug failed portfolioSlug="${query.portfolioSlug}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Programmes introuvables');
    }
  }
}
