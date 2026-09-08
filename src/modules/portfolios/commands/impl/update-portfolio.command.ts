import { Command } from '@nestjs/cqrs';
import { UpdatePortfolioDto } from '../../dto';
import { Portfolio } from '../../entities';

export class UpdatePortfolio extends Command<Portfolio> {
  constructor(
    public readonly id: string,
    public readonly updatePortfolioDto: UpdatePortfolioDto
  ) {
    super();
  }
}
