import { Query } from '@nestjs/cqrs';
import { Portfolio } from '../../entities';

export class FindPortfolioBySlug extends Query<Portfolio> {
  constructor(public readonly slug: string) {
    super();
  }
}
