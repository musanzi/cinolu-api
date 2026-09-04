import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ForgotPassword } from '../impl';
import { ResetPasswordRequestedEvent } from '../../events';
import { FindUserByEmail } from '@/modules/users/queries';

@CommandHandler(ForgotPassword)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPassword, void> {
  private readonly logger = new Logger(ForgotPasswordHandler.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async execute(command: ForgotPassword): Promise<void> {
    const { email } = command.forgotPasswordDto;

    try {
      const user = await this.queryBus.execute(new FindUserByEmail(email));

      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = { sub: user.id, name: user.name, email: user.email };
      const token = await this.jwtService.signAsync(payload, { secret, expiresIn: '15m' });

      const frontendUri = this.configService.get<string>('FRONTEND_URI');
      const link = `${frontendUri}/auth/reset-password?token=${token}`;

      this.eventBus.publish(new ResetPasswordRequestedEvent(user, link));
    } catch (error) {
      this.logger.error(
        `Forgot password failed email="${email}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Demande invalide');
    }
  }
}
