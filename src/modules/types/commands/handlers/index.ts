import { Provider } from '@nestjs/common';
import { CreateTypeHandler } from './create-type.handler';
import { DeleteTypeHandler } from './delete-type.handler';
import { UpdateTypeHandler } from './update-type.handler';

export const CommandHandlers: Provider[] = [CreateTypeHandler, UpdateTypeHandler, DeleteTypeHandler];
