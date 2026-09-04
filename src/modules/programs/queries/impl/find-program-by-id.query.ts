import { Query } from '@nestjs/cqrs';
import { Program } from '../../entities/program.entity';

export class FindProgramById extends Query<Program> {
  constructor(public readonly id: string) {
    super();
  }
}
