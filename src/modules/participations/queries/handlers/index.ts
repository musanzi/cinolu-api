import { Provider } from '@nestjs/common';
import { FindMyParticipationsHandler } from './find-my-participations.handler';
import { FindParticipationByIdHandler } from './find-participation-by-id.handler';
import { FindParticipationsHandler } from './find-participations.handler';

export const QueryHandlers: Provider[] = [
  FindParticipationByIdHandler,
  FindMyParticipationsHandler,
  FindParticipationsHandler
];
