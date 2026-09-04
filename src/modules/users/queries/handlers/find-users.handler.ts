import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mapUsersRoles } from '../../helpers/user-mappers';
import { User } from '../../entities/user.entity';
import { IUserResponse } from '../../interfaces';
import { parsePaginationParams } from '@/shared/helpers';
import { FindUsers } from '../impl';

@QueryHandler(FindUsers)
export class FindUsersHandler implements IQueryHandler<FindUsers, [IUserResponse[], number]> {
  private readonly logger = new Logger(FindUsersHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async execute(query: FindUsers): Promise<[IUserResponse[], number]> {
    try {
      const { q } = query.params;
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);

      const queryBuilder = this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'roles')
        .orderBy('user.updatedAt', 'DESC');
      if (q) queryBuilder.where('user.name LIKE :q OR user.email LIKE :q', { q: `%${q}%` });

      const [users, total] = await queryBuilder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
      return [mapUsersRoles(users), total];
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Find users failed options="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Utilisateurs introuvables');
    }
  }
}
