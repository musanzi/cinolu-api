import { Provider } from '@nestjs/common';
import { FindMyParticipationsHandler } from './find-my-participations.handler';
import { FindOwnedParticipationByIdHandler } from './find-owned-participation-by-id.handler';
import { FindParticipationByIdHandler } from './find-participation-by-id.handler';
import { FindParticipationByParticipantAndActivityHandler } from './find-participation-by-participant-and-activity.handler';
import { FindParticipationsHandler } from './find-participations.handler';

export const QueryHandlers: Provider[] = [
  FindParticipationByIdHandler,
  FindOwnedParticipationByIdHandler,
  FindParticipationByParticipantAndActivityHandler,
  FindMyParticipationsHandler,
  FindParticipationsHandler
];
