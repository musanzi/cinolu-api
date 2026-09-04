import { Query } from '@nestjs/cqrs';
import { Activity } from '../../../entities/activity.entity';

export class FindActivitiesByProgramSlug extends Query<Activity[]> {
  constructor(public readonly programSlug: string) {
    super();
  }
}
