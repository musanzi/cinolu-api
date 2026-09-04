import { Provider } from '@nestjs/common';
import { CreateActivityHandler, DeleteActivityHandler, UpdateActivityHandler } from './activity';
import {
  CreateActivityCategoryHandler,
  DeleteActivityCategoryHandler,
  UpdateActivityCategoryHandler
} from './activity-category';
import { CreateActivityTypeHandler, DeleteActivityTypeHandler, UpdateActivityTypeHandler } from './activity-type';

export const CommandHandlers: Provider[] = [
  CreateActivityHandler,
  UpdateActivityHandler,
  DeleteActivityHandler,
  CreateActivityCategoryHandler,
  UpdateActivityCategoryHandler,
  DeleteActivityCategoryHandler,
  CreateActivityTypeHandler,
  UpdateActivityTypeHandler,
  DeleteActivityTypeHandler
];
