import { IMonthlyCount, INamedCount } from '@/shared/interfaces';
import { VentureStatus } from './venture.interface';

export interface IVentureMonthlyStatusCount extends IMonthlyCount {
  status: VentureStatus;
}

export interface IVentureAdminStatistics {
  total: number;
  byStatus: INamedCount[];
  trend: IVentureMonthlyStatusCount[];
}

export interface IVentureStatusCountRow {
  status: VentureStatus;
  total: string;
}

export interface IVentureMonthlyStatusCountRow extends IVentureStatusCountRow {
  month: string;
}
