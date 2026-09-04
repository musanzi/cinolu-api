import { Command } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { ResetPasswordDto } from '../../dto';

export class ResetPassword extends Command<IUserResponse> {
  constructor(public readonly resetPasswordDto: ResetPasswordDto) {
    super();
  }
}
