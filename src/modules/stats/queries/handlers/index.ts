import { Provider } from '@nestjs/common';
import { FindStatsHandler } from './find-stats.handler';
import { FindUserStatsHandler } from './find-user-stats.handler';

export const QueryHandlers: Provider[] = [FindStatsHandler, FindUserStatsHandler];
