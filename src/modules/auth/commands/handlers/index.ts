import { Provider } from '@nestjs/common';
import { ForgotPasswordHandler } from './forgot-password.handler';
import { ResetPasswordHandler } from './reset-password.handler';
import { SignOutHandler } from './sign-out.handler';
import { SignUpHandler } from './sign-up.handler';
import { UpdatePasswordHandler } from './update-password.handler';
import { UpdateProfileHandler } from './update-profile.handler';

export const CommandHandlers: Provider[] = [
  SignUpHandler,
  SignOutHandler,
  UpdateProfileHandler,
  UpdatePasswordHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler
];
