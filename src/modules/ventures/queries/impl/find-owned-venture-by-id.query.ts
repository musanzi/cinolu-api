import { Query } from '@nestjs/cqrs';
import { Venture } from '../../entities';

export class FindOwnedVentureById extends Query<Venture> {
  constructor(
    public readonly id: string,
    public readonly ownerId: string
  ) {
    super();
  }
}
