import { User } from '../entities/user.entity';

export type IUserResponse = Omit<User, 'roles'> & {
  roles: string[];
};
