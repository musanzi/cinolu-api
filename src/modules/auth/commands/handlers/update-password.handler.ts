import { BadRequestException, Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { UpdateUser } from '@/modules/users/commands';
import { UpdatePassword } from '../impl';
import { FindUserByEmail } from '@/modules/users/queries';

@CommandHandler(UpdatePassword)
export class UpdatePasswordHandler implements ICommandHandler<UpdatePassword, IUserResponse> {
  private readonly logger = new Logger(UpdatePasswordHandler.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdatePassword): Promise<IUserResponse> {
    const { currentUser, updatePasswordDto } = command;

    try {
      await this.commandBus.execute(new UpdateUser(currentUser.id, updatePasswordDto));

      return await this.queryBus.execute(new FindUserByEmail(currentUser.email));
    } catch (error) {
      this.logger.error(
        `Update password failed id="${currentUser?.id ?? ''}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Mise à jour impossible');
    }
  }
}
