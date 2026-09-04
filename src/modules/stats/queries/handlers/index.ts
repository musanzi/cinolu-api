import { Provider } from '@nestjs/common';
import { FindStatsHandler } from './find-stats.handler';

export const QueryHandlers: Provider[] = [FindStatsHandler];
