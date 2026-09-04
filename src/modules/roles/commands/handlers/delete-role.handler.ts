import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { FindRoleById } from '../../queries';
import { DeleteRole } from '../impl';

@CommandHandler(DeleteRole)
export class DeleteRoleHandler implements ICommandHandler<DeleteRole, void> {
  private readonly logger = new Logger(DeleteRoleHandler.name);

  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteRole): Promise<void> {
    try {
      await this.queryBus.execute(new FindRoleById(command.id));

      await this.repository.delete(command.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Delete role failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Suppression du rôle impossible');
    }
  }
}
