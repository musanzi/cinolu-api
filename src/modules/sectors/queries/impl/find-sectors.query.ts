import { Query } from '@nestjs/cqrs';
import { Sector } from '../../entities';
import { IFilterSectors } from '../../interfaces';

export class FindSectors extends Query<[Sector[], number]> {
  constructor(public readonly params: IFilterSectors = {}) {
    super();
  }
}
