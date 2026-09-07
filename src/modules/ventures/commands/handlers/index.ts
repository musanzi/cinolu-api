import {
  CreateVentureHandler,
  DeleteVentureHandler,
  UpdateVentureHandler,
  UpdateVentureStatusHandler
} from './ventures';
import { Provider } from '@nestjs/common';
import {
  CreateVentureCategoryHandler,
  DeleteVentureCategoryHandler,
  UpdateVentureCategoryHandler
} from './venture-category';

export const CommandHandlers: Provider[] = [
  CreateVentureCategoryHandler,
  DeleteVentureCategoryHandler,
  UpdateVentureCategoryHandler,
  CreateVentureHandler,
  DeleteVentureHandler,
  UpdateVentureHandler,
  UpdateVentureStatusHandler
];
