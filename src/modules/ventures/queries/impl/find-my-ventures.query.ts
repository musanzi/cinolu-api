import { Query } from '@nestjs/cqrs';
import { Venture } from '../../entities';
import { IFilterVentures } from '../../interfaces';

export class FindMyVentures extends Query<[Venture[], number]> {
  constructor(
    public readonly ownerId: string,
    public readonly params: IFilterVentures
  ) {
    super();
  }
}
