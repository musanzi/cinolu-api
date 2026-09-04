import { Query } from '@nestjs/cqrs';
import { Program } from '../../entities/program.entity';
import { IFilterPrograms } from '../../interfaces';

export class FindPrograms extends Query<[Program[], number]> {
  constructor(public readonly params: IFilterPrograms) {
    super();
  }
}
