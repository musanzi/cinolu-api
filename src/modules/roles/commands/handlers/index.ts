import { Provider } from '@nestjs/common';
import { CreateRoleHandler } from './create-role.handler';
import { DeleteRoleHandler } from './delete-role.handler';
import { UpdateRoleHandler } from './update-role.handler';

export const CommandHandlers: Provider[] = [CreateRoleHandler, UpdateRoleHandler, DeleteRoleHandler];
