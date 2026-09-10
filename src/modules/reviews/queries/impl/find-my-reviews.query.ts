import { Query } from '@nestjs/cqrs';
import { Review } from '../../entities';
import { IFilterReviews } from '../../interfaces';

export class FindMyReviews extends Query<[Review[], number]> {
  constructor(
    public readonly reviewerId: string,
    public readonly params: IFilterReviews = {}
  ) {
    super();
  }
}
