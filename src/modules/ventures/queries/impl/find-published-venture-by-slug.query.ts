import { Query } from '@nestjs/cqrs';
import { Venture } from '../../entities';

export class FindPublishedVentureBySlug extends Query<Venture> {
  constructor(public readonly slug: string) {
    super();
  }
}
