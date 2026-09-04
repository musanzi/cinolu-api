import { Query } from '@nestjs/cqrs';
import { IVentureAdminStatistics } from '../../interfaces';

export class GetVentureAdminStatistics extends Query<IVentureAdminStatistics> {
  constructor(
    public readonly from: Date,
    public readonly to: Date
  ) {
    super();
  }
}
