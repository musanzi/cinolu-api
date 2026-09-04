import { Provider } from '@nestjs/common';
import { SendWelcomeEmailHandler } from './send-welcome-email.handler';

export const EventHandlers: Provider[] = [SendWelcomeEmailHandler];
