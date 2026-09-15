import { Provider } from '@nestjs/common';
import { FindMyVenturesHandler } from './find-my-ventures.handler';
import { FindVentureByIdHandler } from './find-venture-by-id.handler';
import { FindVenturesHandler } from './find-ventures.handler';

export const QueryHandlers: Provider[] = [FindVentureByIdHandler, FindMyVenturesHandler, FindVenturesHandler];
