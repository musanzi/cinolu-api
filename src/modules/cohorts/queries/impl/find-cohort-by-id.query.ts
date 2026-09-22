import { Query } from '@nestjs/cqrs';
import { Cohort } from '../../entities';

export class FindCohortById extends Query<Cohort> {
  constructor(public readonly id: string) {
    super();
  }
}
