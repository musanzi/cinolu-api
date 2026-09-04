import { Provider } from '@nestjs/common';
import { CountUsersByIdsHandler } from './count-users-by-ids.handler';
import { ExportUsersCsvHandler } from './export-users-csv.handler';
import { FindUserByEmailHandler } from './find-user-by-email.handler';
import { FindUserByIdHandler } from './find-user-by-id.handler';
import { FindUsersHandler } from './find-users.handler';
import { GetUserAdminStatisticsHandler } from './get-user-admin-statistics.handler';

export const QueryHandlers: Provider[] = [
  CountUsersByIdsHandler,
  FindUsersHandler,
  FindUserByIdHandler,
  FindUserByEmailHandler,
  ExportUsersCsvHandler,
  GetUserAdminStatisticsHandler
];
