import { Provider } from '@nestjs/common';
import { FindActivitiesHandler } from './find-activities.handler';
import { FindActivityByIdHandler } from './find-activity-by-id.handler';
import { FindPublishedActivityBySlugHandler } from './find-published-activity-by-slug.handler';
import { FindRecentActivitiesHandler } from './find-recent-activities.handler';

export const QueryHandlers: Provider[] = [
  FindActivitiesHandler,
  FindActivityByIdHandler,
  FindPublishedActivityBySlugHandler,
  FindRecentActivitiesHandler
];
