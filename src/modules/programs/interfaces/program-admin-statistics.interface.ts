import { INamedCount } from '@/shared/interfaces';

export interface IProgramAdminStatistics {
  total: number;
  byPortfolio: INamedCount[];
}
