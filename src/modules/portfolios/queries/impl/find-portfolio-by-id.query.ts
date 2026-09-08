import { Query } from '@nestjs/cqrs';
import { Portfolio } from '../../entities';

export class FindPortfolioById extends Query<Portfolio> {
  constructor(public readonly id: string) {
    super();
  }
}
