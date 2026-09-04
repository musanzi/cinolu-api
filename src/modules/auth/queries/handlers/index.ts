import { Provider } from '@nestjs/common';
import { GoogleRedirectHandler } from './google-redirect.handler';
import { ProfileHandler } from './get-profile.handler';
import { SignInHandler } from './sign-in.handler';
import { ValidateCredentialsHandler } from './validate-credentials.handler';

export const QueryHandlers: Provider[] = [
  SignInHandler,
  GoogleRedirectHandler,
  ProfileHandler,
  ValidateCredentialsHandler
];
