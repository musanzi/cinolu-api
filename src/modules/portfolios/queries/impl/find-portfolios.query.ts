import { Query } from '@nestjs/cqrs';
import { Portfolio } from '../../entities';
import { IFilterPortfolios } from '../../interfaces';

export class FindPortfolios extends Query<[Portfolio[], number]> {
  constructor(public readonly params: IFilterPortfolios = {}) {
    super();
  }
}
