import { BadRequestException, Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IUserResponse } from '@/modules/users/interfaces';
import { UpdateUser } from '@/modules/users/commands';
import { ResetPassword } from '../impl';

@CommandHandler(ResetPassword)
export class ResetPasswordHandler implements ICommandHandler<ResetPassword, IUserResponse> {
  private readonly logger = new Logger(ResetPasswordHandler.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async execute(command: ResetPassword): Promise<IUserResponse> {
    const { token, password } = command.resetPasswordDto;

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, { secret });

      return await this.commandBus.execute(new UpdateUser(payload.sub, { password }));
    } catch (error) {
      this.logger.error(`Reset password failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException('Mot de passe invalide');
    }
  }
}
