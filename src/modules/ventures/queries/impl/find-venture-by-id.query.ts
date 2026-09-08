import { Query } from '@nestjs/cqrs';
import { Venture } from '../../entities';

export class FindVentureById extends Query<Venture> {
  constructor(public readonly id: string) {
    super();
  }
}
