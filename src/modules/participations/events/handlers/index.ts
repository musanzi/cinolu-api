import { Provider } from '@nestjs/common';
import { SendParticipationStatusEmailHandler } from './send-participation-status-email.handler';

export const EventHandlers: Provider[] = [SendParticipationStatusEmailHandler];
