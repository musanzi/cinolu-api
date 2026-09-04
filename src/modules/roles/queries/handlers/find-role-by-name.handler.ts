import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { FindRoleByName } from '../impl';

@QueryHandler(FindRoleByName)
export class FindRoleByNameHandler implements IQueryHandler<FindRoleByName, Role> {
  private readonly logger = new Logger(FindRoleByNameHandler.name);

  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>
  ) {}

  async execute(query: FindRoleByName): Promise<Role> {
    try {
      return await this.repository.findOneOrFail({
        where: { name: query.name }
      });
    } catch (error) {
      this.logger.error(
        `Find role by name failed name="${query.name}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Rôle introuvable');
    }
  }
}
