import { Query } from '@nestjs/cqrs';
import { Activity } from '../../entities';
import { IFilterActivities } from '../../interfaces';

export class FindActivities extends Query<[Activity[], number]> {
  constructor(
    public readonly params: IFilterActivities = {},
    public readonly publishedOnly = false
  ) {
    super();
  }
}
