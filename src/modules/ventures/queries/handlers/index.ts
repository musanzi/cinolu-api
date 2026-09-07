import {
  FindMyVenturesHandler,
  FindPublishedVentureBySlugHandler,
  FindPublishedVenturesHandler,
  FindVentureByIdHandler,
  FindVenturesHandler,
  GetVentureAdminStatisticsHandler
} from './ventures';
import { Provider } from '@nestjs/common';
import {
  CountVentureCategoriesByIdsHandler,
  FindVentureCategoriesHandler,
  FindVentureCategoryByIdHandler
} from './venture-category';

export const QueryHandlers: Provider[] = [
  CountVentureCategoriesByIdsHandler,
  FindVentureCategoriesHandler,
  FindVentureCategoryByIdHandler,
  FindMyVenturesHandler,
  FindPublishedVentureBySlugHandler,
  FindPublishedVenturesHandler,
  FindVentureByIdHandler,
  FindVenturesHandler,
  GetVentureAdminStatisticsHandler
];
