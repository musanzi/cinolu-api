import { Provider } from '@nestjs/common';
import { CreateCategoryHandler } from './create-category.handler';
import { DeleteCategoryHandler } from './delete-category.handler';
import { UpdateCategoryHandler } from './update-category.handler';

export const CommandHandlers: Provider[] = [CreateCategoryHandler, UpdateCategoryHandler, DeleteCategoryHandler];
