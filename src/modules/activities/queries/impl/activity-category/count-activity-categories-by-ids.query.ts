import { Query } from '@nestjs/cqrs';

export class CountActivityCategoriesByIds extends Query<number> {
  constructor(public readonly ids: string[]) {
    super();
  }
}
