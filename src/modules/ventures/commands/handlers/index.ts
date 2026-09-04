import { Provider } from '@nestjs/common';
import { CreateVentureHandler } from './create-venture.handler';
import { DeleteVentureHandler } from './delete-venture.handler';
import { UpdateVentureHandler } from './update-venture.handler';
import { UpdateVentureStatusHandler } from './update-venture-status.handler';

export const CommandHandlers: Provider[] = [
  CreateVentureHandler,
  DeleteVentureHandler,
  UpdateVentureHandler,
  UpdateVentureStatusHandler
];
