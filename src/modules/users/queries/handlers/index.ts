import { Provider } from '@nestjs/common';
import { ExportUsersCsvHandler } from './export-users-csv.handler';
import { FindUserByEmailHandler } from './find-user-by-email.handler';
import { FindUserByIdHandler } from './find-user-by-id.handler';
import { FindUsersHandler } from './find-users.handler';

export const QueryHandlers: Provider[] = [
  FindUsersHandler,
  FindUserByIdHandler,
  FindUserByEmailHandler,
  ExportUsersCsvHandler
];
