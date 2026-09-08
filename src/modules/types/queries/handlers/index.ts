import { Provider } from '@nestjs/common';
import { FindTypeByIdHandler } from './find-type-by-id.handler';
import { FindTypesHandler } from './find-types.handler';

export const QueryHandlers: Provider[] = [FindTypeByIdHandler, FindTypesHandler];
