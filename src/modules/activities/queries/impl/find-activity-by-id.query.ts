import { Query } from '@nestjs/cqrs';
import { Activity } from '../../entities';

export class FindActivityById extends Query<Activity> {
  constructor(public readonly id: string) {
    super();
  }
}
