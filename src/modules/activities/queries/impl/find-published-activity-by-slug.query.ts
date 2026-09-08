import { Query } from '@nestjs/cqrs';
import { Activity } from '../../entities';

export class FindPublishedActivityBySlug extends Query<Activity> {
  constructor(public readonly slug: string) {
    super();
  }
}
