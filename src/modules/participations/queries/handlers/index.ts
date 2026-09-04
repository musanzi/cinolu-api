import { Provider } from '@nestjs/common';
import { ExportParticipationsCsvHandler } from './export-participations-csv.handler';
import { FindActivityParticipationsHandler } from './find-activity-participations.handler';
import { FindMyParticipationsHandler } from './find-my-participations.handler';
import { FindParticipationByIdHandler } from './find-participation-by-id.handler';
import { GetParticipationAdminStatisticsHandler } from './get-participation-admin-statistics.handler';

export const QueryHandlers: Provider[] = [
  FindMyParticipationsHandler,
  FindActivityParticipationsHandler,
  FindParticipationByIdHandler,
  ExportParticipationsCsvHandler,
  GetParticipationAdminStatisticsHandler
];
