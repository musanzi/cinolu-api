import { Provider } from '@nestjs/common';
import { ExportUsersCsvHandler } from './export-users-csv.handler';
import { FindMentorsHandler } from './find-mentors.handler';
import { FindUserByEmailHandler } from './find-user-by-email.handler';
import { FindUserByIdHandler } from './find-user-by-id.handler';
import { FindStaffHandler } from './find-staff.handler';
import { FindUsersHandler } from './find-users.handler';

export const QueryHandlers: Provider[] = [
  FindUsersHandler,
  FindStaffHandler,
  FindMentorsHandler,
  FindUserByIdHandler,
  FindUserByEmailHandler,
  ExportUsersCsvHandler
];
