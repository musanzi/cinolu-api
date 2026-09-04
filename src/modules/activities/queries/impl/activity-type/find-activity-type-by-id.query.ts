import { Query } from '@nestjs/cqrs';
import { ActivityType } from '../../../entities';

export class FindActivityTypeById extends Query<ActivityType> {
  constructor(public readonly id: string) {
    super();
  }
}
