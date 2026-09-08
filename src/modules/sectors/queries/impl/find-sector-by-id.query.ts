import { Query } from '@nestjs/cqrs';
import { Sector } from '../../entities';

export class FindSectorById extends Query<Sector> {
  constructor(public readonly id: string) {
    super();
  }
}
