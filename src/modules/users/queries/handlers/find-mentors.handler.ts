import { Roles } from '@/modules/auth/enums';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { mapUsersRoles } from '../../helpers';
import { IUserResponse } from '../../interfaces';
import { FindMentors } from '../impl';

@QueryHandler(FindMentors)
export class FindMentorsHandler implements IQueryHandler<FindMentors, IUserResponse[]> {
  private readonly logger = new Logger(FindMentorsHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async execute(): Promise<IUserResponse[]> {
    try {
      const users = await this.repository
        .createQueryBuilder('user')
        .innerJoin('user.roles', 'mentorRole', 'mentorRole.name = :role', { role: Roles.MENTOR })
        .leftJoinAndSelect('user.roles', 'roles')
        .orderBy('user.updatedAt', 'DESC')
        .getMany();

      return mapUsersRoles(users);
    } catch (error) {
      this.logger.error(`Find mentor users failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException('Mentors introuvables');
    }
  }
}
