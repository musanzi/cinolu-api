import { Query } from '@nestjs/cqrs';
import { Role } from '../../entities/role.entity';

export class FindRoleById extends Query<Role> {
  constructor(public readonly id: string) {
    super();
  }
}
