import { Command } from '@nestjs/cqrs';
import { UpdateRoleDto } from '../../dto';
import { Role } from '../../entities/role.entity';

export class UpdateRole extends Command<Role> {
  constructor(
    public readonly id: string,
    public readonly updateRoleDto: UpdateRoleDto
  ) {
    super();
  }
}
