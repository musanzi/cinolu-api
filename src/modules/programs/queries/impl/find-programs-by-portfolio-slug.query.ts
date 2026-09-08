import { Query } from '@nestjs/cqrs';
import { Program } from '../../entities';

export class FindProgramsByPortfolioSlug extends Query<Program[]> {
  constructor(public readonly portfolioSlug: string) {
    super();
  }
}
