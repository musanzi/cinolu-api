import { Command } from '@nestjs/cqrs';
import { CreateRoleDto } from '../../dto';
import { Role } from '../../entities/role.entity';

export class CreateRole extends Command<Role> {
  constructor(public readonly createRoleDto: CreateRoleDto) {
    super();
  }
}
