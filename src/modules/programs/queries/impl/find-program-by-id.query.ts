import { Query } from '@nestjs/cqrs';
import { Program } from '../../entities';

export class FindProgramById extends Query<Program> {
  constructor(public readonly id: string) {
    super();
  }
}
