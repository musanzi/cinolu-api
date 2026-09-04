import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { CreateRole } from '../impl';

@CommandHandler(CreateRole)
export class CreateRoleHandler implements ICommandHandler<CreateRole, Role> {
  private readonly logger = new Logger(CreateRoleHandler.name);

  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>
  ) {}

  async execute(command: CreateRole): Promise<Role> {
    const { createRoleDto } = command;

    try {
      const role = this.repository.create(createRoleDto);

      return await this.repository.save(role);
    } catch (error) {
      this.logger.error(
        `Create role failed name="${createRoleDto.name}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Création du rôle impossible');
    }
  }
}
