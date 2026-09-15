import { Query } from '@nestjs/cqrs';
import { IUserStatsDashboard } from '../../interfaces';

export class FindUserStats extends Query<IUserStatsDashboard> {
  constructor(
    public readonly userId: string,
    public readonly months: number
  ) {
    super();
  }
}
