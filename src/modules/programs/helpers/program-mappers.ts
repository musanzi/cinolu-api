import { User } from '@/modules/users/entities/user.entity';

export function mapProgramManagers(ids?: string[]): Pick<User, 'id'>[] | undefined {
  return ids?.map((id) => ({ id }));
}
