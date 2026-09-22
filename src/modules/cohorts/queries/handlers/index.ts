import { Provider } from '@nestjs/common';
import { FindCohortByIdHandler } from './find-cohort-by-id.handler';
import { FindCohortsHandler } from './find-cohorts.handler';

export const QueryHandlers: Provider[] = [FindCohortsHandler, FindCohortByIdHandler];
