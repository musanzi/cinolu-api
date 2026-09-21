import { Query } from '@nestjs/cqrs';
import { Program } from '../../entities';

export class FindProgramBySlug extends Query<Program> {
  constructor(public readonly slug: string) {
    super();
  }
}
