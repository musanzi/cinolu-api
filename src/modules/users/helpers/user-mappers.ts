import { Role } from '../../roles/entities/role.entity';
import { User } from '../entities/user.entity';
import { IUserResponse } from '../interfaces';

export function mapRoleIds(roleIds?: string[] | null): Pick<Role, 'id'>[] | undefined {
  if (!roleIds) return undefined;
  return roleIds.map((id) => ({ id }));
}

export function mapUserRoles(user: User): IUserResponse {
  if (!user?.roles) return { ...user, roles: [] };
  const roles = user.roles.map((role) => role.name);
  return { ...user, roles };
}

export function mapUsersRoles(users: User[]): IUserResponse[] {
  return users.map(mapUserRoles);
}
