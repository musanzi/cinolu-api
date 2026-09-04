import { Query } from '@nestjs/cqrs';
import { Portfolio } from '../../entities/portfolio.entity';
import { IFilterPortfolios } from '../../interfaces';

export class FindPortfolios extends Query<[Portfolio[], number]> {
  constructor(public readonly params: IFilterPortfolios) {
    super();
  }
}
