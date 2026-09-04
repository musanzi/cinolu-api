import { Command } from '@nestjs/cqrs';
import { CreatePortfolioDto } from '../../dto';
import { Portfolio } from '../../entities/portfolio.entity';

export class CreatePortfolio extends Command<Portfolio> {
  constructor(public readonly createPortfolioDto: CreatePortfolioDto) {
    super();
  }
}
