import { Provider } from '@nestjs/common';
import { DeleteParticipationHandler } from './delete-participation.handler';
import { SaveParticipationHandler } from './save-participation.handler';
import { UpdateParticipationHandler } from './update-participation.handler';
import { UpdateParticipationStatusHandler } from './update-participation-status.handler';

export const CommandHandlers: Provider[] = [
  DeleteParticipationHandler,
  SaveParticipationHandler,
  UpdateParticipationHandler,
  UpdateParticipationStatusHandler
];
