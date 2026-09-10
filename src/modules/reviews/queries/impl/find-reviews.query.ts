import { Query } from '@nestjs/cqrs';
import { Review } from '../../entities';
import { IFilterReviews } from '../../interfaces';

export class FindReviews extends Query<[Review[], number]> {
  constructor(public readonly params: IFilterReviews = {}) {
    super();
  }
}
