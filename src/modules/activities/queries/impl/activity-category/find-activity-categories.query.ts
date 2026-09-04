import { Query } from '@nestjs/cqrs';
import { ActivityCategory } from '../../../entities';
import { IFilterActivityCategories } from '../../../interfaces';

export class FindActivityCategories extends Query<[ActivityCategory[], number]> {
  constructor(public readonly params: IFilterActivityCategories = {}) {
    super();
  }
}
