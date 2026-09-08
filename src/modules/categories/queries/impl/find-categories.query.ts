import { Query } from '@nestjs/cqrs';
import { Category } from '../../entities';
import { IFilterCategories } from '../../interfaces';

export class FindCategories extends Query<[Category[], number]> {
  constructor(public readonly params: IFilterCategories = {}) {
    super();
  }
}
