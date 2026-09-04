import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { Program } from '../../entities/program.entity';

export class FindManagedProgramById extends Query<Program> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly id: string
  ) {
    super();
  }
}
