import { Provider } from '@nestjs/common';
import {
  FindActivitiesHandler,
  FindActivitiesByProgramSlugHandler,
  FindActivityByIdHandler,
  FindManagedActivityByIdHandler,
  FindRecentActivitiesHandler,
  GetActivityAdminStatisticsHandler
} from './activity';
import {
  CountActivityCategoriesByIdsHandler,
  FindActivityCategoriesHandler,
  FindActivityCategoryByIdHandler
} from './activity-category';
import { FindActivityTypeByIdHandler, FindActivityTypesHandler } from './activity-type';

export const QueryHandlers: Provider[] = [
  FindActivitiesHandler,
  FindActivitiesByProgramSlugHandler,
  FindActivityByIdHandler,
  FindManagedActivityByIdHandler,
  FindRecentActivitiesHandler,
  CountActivityCategoriesByIdsHandler,
  FindActivityCategoriesHandler,
  FindActivityCategoryByIdHandler,
  FindActivityTypesHandler,
  FindActivityTypeByIdHandler,
  GetActivityAdminStatisticsHandler
];
