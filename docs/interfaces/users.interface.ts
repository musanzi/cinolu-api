/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { EntityFields } from './common.interface';
import type { Role } from './roles.interface';

export type UserSocialLinks = Record<string, unknown>;

export interface UserResponse extends EntityFields {
  email: string;
  name: string;
  avatar: string | null;
  socialLinks: UserSocialLinks;
  roles: string[]; // role names, e.g. user, staff, mentor
}

export type UserRelation = Omit<UserResponse, 'roles'> & { roles?: Role[] };

export interface CreateUserBody {
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  socialLinks?: UserSocialLinks;
  roles?: string[]; // role UUIDs
}

export interface UpdateUserBody {
  email?: string;
  name?: string;
  password?: string;
  avatar?: string;
  socialLinks?: UserSocialLinks;
  roles?: string[]; // role UUIDs
}

export interface UploadAvatarBody {
  avatar: File; /* append to FormData, not JSON */
}

export interface ImportUsersBody {
  file: File; /* append to FormData, not JSON */
}

export interface ExportUsersQuery {
  q?: string;
}
