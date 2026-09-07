import { Query } from '@nestjs/cqrs';

export class CountVentureCategoriesByIds extends Query<number> {
  constructor(public readonly ids: string[]) {
    super();
  }
}
