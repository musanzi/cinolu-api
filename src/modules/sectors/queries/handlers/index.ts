import { Provider } from '@nestjs/common';
import { FindSectorByIdHandler } from './find-sector-by-id.handler';
import { FindSectorsHandler } from './find-sectors.handler';

export const QueryHandlers: Provider[] = [FindSectorByIdHandler, FindSectorsHandler];
