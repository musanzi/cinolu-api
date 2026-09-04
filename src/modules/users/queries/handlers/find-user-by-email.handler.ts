import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { IUserResponse } from '../../interfaces';
import { FindUserByEmail } from '../impl';
import { mapUserRoles } from '../../helpers';

@QueryHandler(FindUserByEmail)
export class FindUserByEmailHandler implements IQueryHandler<FindUserByEmail, IUserResponse> {
  private readonly logger = new Logger(FindUserByEmailHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async execute(query: FindUserByEmail): Promise<IUserResponse> {
    const { email, includePassword } = query;

    try {
      const query = this.repository
        .createQueryBuilder('u')
        .where('u.email = :email', { email })
        .innerJoinAndSelect('u.roles', 'roles');

      if (includePassword) {
        query.addSelect('u.password');
      }

      const user = await query.getOneOrFail();

      return mapUserRoles(user);
    } catch (error) {
      this.logger.error(
        `Find user by email failed email="${email}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Utilisateur introuvable');
    }
  }
}
