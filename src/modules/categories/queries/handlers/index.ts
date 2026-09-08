import { Provider } from '@nestjs/common';
import { FindCategoriesHandler } from './find-categories.handler';
import { FindCategoryByIdHandler } from './find-category-by-id.handler';

export const QueryHandlers: Provider[] = [FindCategoryByIdHandler, FindCategoriesHandler];
