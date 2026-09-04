import { Query } from '@nestjs/cqrs';
import { ActivityCategory } from '../../../entities';

export class FindActivityCategoryById extends Query<ActivityCategory> {
  constructor(public readonly id: string) {
    super();
  }
}
