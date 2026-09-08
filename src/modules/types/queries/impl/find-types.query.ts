import { Query } from '@nestjs/cqrs';
import { Type } from '../../entities';
import { IFilterTypes } from '../../interfaces';

export class FindTypes extends Query<[Type[], number]> {
  constructor(public readonly params: IFilterTypes = {}) {
    super();
  }
}
