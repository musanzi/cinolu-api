import { Query } from '@nestjs/cqrs';

export class CountUsersByIds extends Query<number> {
  constructor(public readonly ids: string[]) {
    super();
  }
}
