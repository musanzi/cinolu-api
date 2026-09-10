import { Provider } from '@nestjs/common';
import { CreateParticipationHandler } from './create-participation.handler';
import { UpdateParticipationStatusHandler } from './update-participation-status.handler';
import { UpdateParticipationHandler } from './update-participation.handler';

export const CommandHandlers: Provider[] = [
  CreateParticipationHandler,
  UpdateParticipationHandler,
  UpdateParticipationStatusHandler
];
