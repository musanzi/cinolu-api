import { Query } from '@nestjs/cqrs';
import { Category } from '../../entities';

export class FindCategoryById extends Query<Category> {
  constructor(public readonly id: string) {
    super();
  }
}
