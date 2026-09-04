import { Query } from '@nestjs/cqrs';
import { IStatsDashboard } from '../../interfaces';

export class FindStats extends Query<IStatsDashboard> {
  constructor(public readonly months: number) {
    super();
  }
}
