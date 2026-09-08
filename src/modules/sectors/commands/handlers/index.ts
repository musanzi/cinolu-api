import { Provider } from '@nestjs/common';
import { CreateSectorHandler } from './create-sector.handler';
import { DeleteSectorHandler } from './delete-sector.handler';
import { UpdateSectorHandler } from './update-sector.handler';

export const CommandHandlers: Provider[] = [CreateSectorHandler, UpdateSectorHandler, DeleteSectorHandler];
