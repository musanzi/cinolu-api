import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { FindRoleById } from '../../queries';
import { UpdateRole } from '../impl';

@CommandHandler(UpdateRole)
export class UpdateRoleHandler implements ICommandHandler<UpdateRole, Role> {
  private readonly logger = new Logger(UpdateRoleHandler.name);

  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateRole): Promise<Role> {
    const { id, updateRoleDto } = command;

    try {
      const role = await this.queryBus.execute(new FindRoleById(id));
      const updatedRole = this.repository.merge(role, updateRoleDto);

      return await this.repository.save(updatedRole);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(`Update role failed id="${id}": ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException('Mise à jour du rôle impossible');
    }
  }
}
