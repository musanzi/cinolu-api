import { Query } from '@nestjs/cqrs';
import { VentureCategory } from '../../../entities';

export class FindVentureCategoryById extends Query<VentureCategory> {
  constructor(public readonly id: string) {
    super();
  }
}
