import { Query } from '@nestjs/cqrs';
import { Type } from '../../entities';

export class FindTypeById extends Query<Type> {
  constructor(public readonly id: string) {
    super();
  }
}
