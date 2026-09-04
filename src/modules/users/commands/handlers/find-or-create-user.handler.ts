import { BadRequestException, Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserResponse } from '../../interfaces';
import { CreateUser, FindOrCreateUser, UpdateUser } from '../impl';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(FindOrCreateUser)
export class FindOrCreateUserHandler implements ICommandHandler<FindOrCreateUser, IUserResponse> {
  private readonly logger = new Logger(FindOrCreateUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly commandBus: CommandBus
  ) {}

  async execute(command: FindOrCreateUser): Promise<IUserResponse> {
    const { email, name, password, avatar, roles } = command.createUserDto;

    try {
      const existingUser = await this.repository.findOne({
        where: { email },
        relations: ['roles']
      });

      if (existingUser) {
        return this.commandBus.execute(
          new UpdateUser(existingUser.id, {
            email,
            name,
            password,
            avatar: existingUser.avatar ? undefined : avatar,
            roles
          })
        );
      }

      return await this.commandBus.execute(new CreateUser(command.createUserDto));
    } catch (error) {
      this.logger.error(
        `Find or create user failed email="${email}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Requête invalide');
    }
  }
}
