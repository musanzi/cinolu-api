import { Roles } from '@/modules/auth/enums';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { mapUsersRoles } from '../../helpers';
import { IUserResponse } from '../../interfaces';
import { FindStaff } from '../impl';

@QueryHandler(FindStaff)
export class FindStaffHandler implements IQueryHandler<FindStaff, IUserResponse[]> {
  private readonly logger = new Logger(FindStaffHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async execute(): Promise<IUserResponse[]> {
    try {
      const users = await this.repository
        .createQueryBuilder('user')
        .innerJoin('user.roles', 'staffRole', 'staffRole.name = :role', { role: Roles.STAFF })
        .leftJoinAndSelect('user.roles', 'roles')
        .orderBy('user.updatedAt', 'DESC')
        .getMany();

      return mapUsersRoles(users);
    } catch (error) {
      this.logger.error(`Find staff users failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException('Membres du personnel introuvables');
    }
  }
}
