import { Provider } from '@nestjs/common';
import { FindMyVenturesHandler } from './find-my-ventures.handler';
import { FindPublishedVentureBySlugHandler } from './find-published-venture-by-slug.handler';
import { FindPublishedVenturesHandler } from './find-published-ventures.handler';
import { FindVentureByIdHandler } from './find-venture-by-id.handler';
import { FindVenturesHandler } from './find-ventures.handler';
import { GetVentureAdminStatisticsHandler } from './get-venture-admin-statistics.handler';

export const QueryHandlers: Provider[] = [
  FindMyVenturesHandler,
  FindPublishedVentureBySlugHandler,
  FindPublishedVenturesHandler,
  FindVentureByIdHandler,
  FindVenturesHandler,
  GetVentureAdminStatisticsHandler
];
