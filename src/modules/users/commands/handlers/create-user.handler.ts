import { BadRequestException, Logger } from '@nestjs/common';
import { randomInt } from 'crypto';
import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mapRoleIds } from '../../helpers/user-mappers';
import { User } from '../../entities/user.entity';
import { IUserResponse } from '../../interfaces';
import { FindUserById } from '../../queries';
import { CreateUser } from '../impl';
import { WelcomeUserEvent } from '../../events';
import { FindRoleByName } from '@/modules/roles/queries';

@CommandHandler(CreateUser)
export class CreateUserHandler implements ICommandHandler<CreateUser, IUserResponse> {
  private readonly logger = new Logger(CreateUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: CreateUser): Promise<IUserResponse> {
    const { email, name, password: suppliedPassword, avatar, roles } = command.createUserDto;
    const hasPassword = Boolean(suppliedPassword);
    const generatedPassword = hasPassword ? undefined : randomInt(0, 1_000_000).toString().padStart(6, '0');
    const password = suppliedPassword ?? generatedPassword;

    try {
      const userRoles = roles ? mapRoleIds(roles) : [await this.queryBus.execute(new FindRoleByName('user'))];
      const user = this.repository.create({
        email,
        name,
        password,
        avatar,
        roles: userRoles
      });

      const createdUser = await this.repository.save(user);

      this.eventBus.publish(new WelcomeUserEvent(createdUser, generatedPassword));

      return await this.queryBus.execute(new FindUserById(createdUser.id));
    } catch (error) {
      this.logger.error(
        `Create user failed email="${email}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Création de l'utilisateur impossible");
    }
  }
}
