import { Query } from '@nestjs/cqrs';
import { Cohort } from '../../entities';
import { IFilterCohorts } from '../../interfaces';

export class FindCohorts extends Query<[Cohort[], number]> {
  constructor(public readonly params: IFilterCohorts = {}) {
    super();
  }
}
