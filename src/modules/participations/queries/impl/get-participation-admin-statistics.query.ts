import { Query } from '@nestjs/cqrs';
import { IParticipationAdminStatistics } from '../../interfaces';

export class GetParticipationAdminStatistics extends Query<IParticipationAdminStatistics> {
  constructor(
    public readonly from: Date,
    public readonly to: Date
  ) {
    super();
  }
}
