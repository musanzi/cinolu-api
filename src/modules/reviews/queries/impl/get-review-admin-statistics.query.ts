import { Query } from '@nestjs/cqrs';
import { IReviewAdminStatistics } from '../../interfaces';

export class GetReviewAdminStatistics extends Query<IReviewAdminStatistics> {
  constructor(
    public readonly from: Date,
    public readonly to: Date
  ) {
    super();
  }
}
