import { SetMetadata } from '@nestjs/common';
import { Roles } from '../enums';

export const ROLES_KEY = 'HasRoles';
export const HasRoles = (roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
