import { IMonthlyCount, INamedCount } from '@/modules/stats/interfaces';

export interface IUserStatistics {
  total: number;
  registrations: IMonthlyCount[];
  roles: INamedCount[];
}
