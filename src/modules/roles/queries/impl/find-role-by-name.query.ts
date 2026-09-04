import { Query } from '@nestjs/cqrs';
import { Role } from '../../entities/role.entity';

export class FindRoleByName extends Query<Role> {
  constructor(public readonly name: string) {
    super();
  }
}
