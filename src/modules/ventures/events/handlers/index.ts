import { Provider } from '@nestjs/common';
import { SendVentureStatusEmailHandler } from './send-venture-status-email.handler';

export const EventHandlers: Provider[] = [SendVentureStatusEmailHandler];
