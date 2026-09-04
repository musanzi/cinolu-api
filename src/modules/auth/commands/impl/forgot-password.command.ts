import { Command } from '@nestjs/cqrs';
import { ForgotPasswordDto } from '../../dto';

export class ForgotPassword extends Command<void> {
  constructor(public readonly forgotPasswordDto: ForgotPasswordDto) {
    super();
  }
}
