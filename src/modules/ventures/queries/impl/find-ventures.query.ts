import { Query } from '@nestjs/cqrs';
import { Venture } from '../../entities';
import { IFilterVentures } from '../../interfaces';

export class FindVentures extends Query<[Venture[], number]> {
  constructor(public readonly params: IFilterVentures) {
    super();
  }
}
