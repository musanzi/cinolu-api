import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { IReviewStatistics } from '../../interfaces';
export class GetReviewStatistics extends Query<IReviewStatistics> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly activityId: string
  ) {
    super();
  }
}
