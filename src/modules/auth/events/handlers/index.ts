import { Provider } from '@nestjs/common';
import { SendResetPasswordEmailHandler } from './send-reset-password-email.handler';

export const EventHandlers: Provider[] = [SendResetPasswordEmailHandler];
