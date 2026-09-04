import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { FindRoleById } from '../impl';

@QueryHandler(FindRoleById)
export class FindRoleByIdHandler implements IQueryHandler<FindRoleById, Role> {
  private readonly logger = new Logger(FindRoleByIdHandler.name);

  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>
  ) {}

  async execute(query: FindRoleById): Promise<Role> {
    try {
      return await this.repository.findOneOrFail({
        where: { id: query.id }
      });
    } catch (error) {
      this.logger.error(
        `Find role by id failed id="${query.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Rôle introuvable');
    }
  }
}
