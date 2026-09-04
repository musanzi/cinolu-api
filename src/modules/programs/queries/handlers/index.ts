import { Provider } from '@nestjs/common';
import { FindProgramByIdHandler } from './find-program-by-id.handler';
import { FindProgramsHandler } from './find-programs.handler';
import { FindManagedProgramByIdHandler } from './find-managed-program-by-id.handler';
import { GetProgramAdminStatisticsHandler } from './get-program-admin-statistics.handler';

export const QueryHandlers: Provider[] = [
  FindProgramsHandler,
  FindProgramByIdHandler,
  FindManagedProgramByIdHandler,
  GetProgramAdminStatisticsHandler
];
