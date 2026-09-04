import { Provider } from '@nestjs/common';
import { FindRoleByIdHandler } from './find-role-by-id.handler';
import { FindRoleByNameHandler } from './find-role-by-name.handler';
import { FindRolesHandler } from './find-roles.handler';

export const QueryHandlers: Provider[] = [FindRolesHandler, FindRoleByIdHandler, FindRoleByNameHandler];
