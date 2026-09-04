import { Query } from '@nestjs/cqrs';
import { ActivityType } from '../../../entities';
import { IFilterActivityTypes } from '../../../interfaces';

export class FindActivityTypes extends Query<[ActivityType[], number]> {
  constructor(public readonly params: IFilterActivityTypes = {}) {
    super();
  }
}
