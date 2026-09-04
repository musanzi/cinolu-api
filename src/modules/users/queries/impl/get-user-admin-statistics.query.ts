import { Query } from '@nestjs/cqrs';
import { IUserAdminStatistics } from '../../interfaces';

export class GetUserAdminStatistics extends Query<IUserAdminStatistics> {
  constructor(
    public readonly from: Date,
    public readonly to: Date
  ) {
    super();
  }
}
