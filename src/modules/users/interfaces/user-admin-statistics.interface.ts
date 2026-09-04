import { IMonthlyCount, INamedCount } from '@/shared/interfaces';

export interface IUserAdminStatistics {
  total: number;
  registrations: IMonthlyCount[];
  roles: INamedCount[];
}
