import { Query } from '@nestjs/cqrs';
import { VentureCategory } from '../../../entities';
import { IFilterVentureCategories } from '../../../interfaces';

export class FindVentureCategories extends Query<[VentureCategory[], number]> {
  constructor(public readonly params: IFilterVentureCategories = {}) {
    super();
  }
}
