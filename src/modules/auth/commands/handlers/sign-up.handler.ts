import { BadRequestException, Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { SignUp } from '../impl';
import { FindUserById } from '@/modules/users/queries';
import { CreateUser } from '@/modules/users/commands';

@CommandHandler(SignUp)
export class SignUpHandler implements ICommandHandler<SignUp, IUserResponse> {
  private readonly logger = new Logger(SignUpHandler.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: SignUp): Promise<IUserResponse> {
    const { name, email, password } = command.signUpDto;

    try {
      const user = await this.commandBus.execute(new CreateUser({ email, name, password }));

      return await this.queryBus.execute(new FindUserById(user.id));
    } catch (error) {
      this.logger.error(`Sign up failed email="${email}": ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException(error['message'] ?? 'Inscription impossible');
    }
  }
}
