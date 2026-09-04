import { IMonthlyCount } from '@/shared/interfaces';

export interface IReviewAdminStatistics {
  total: number;
  trend: IMonthlyCount[];
}
