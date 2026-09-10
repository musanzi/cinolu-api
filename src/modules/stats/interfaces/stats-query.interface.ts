import { ParticipationStatus } from '@/modules/participations/interfaces';
import { VentureStatus } from '@/modules/ventures/interfaces';
import { IMonthlyCount, INamedCount } from '@/shared/interfaces';

export interface ICountRow {
  total: string;
}

export interface IMonthlyCountRow extends ICountRow {
  month: string;
}

export interface INamedCountRow extends ICountRow {
  name: string;
}

export interface IStatusCountRow<T> extends ICountRow {
  status: T;
}

export interface IMonthlyStatusCountRow<T> extends IStatusCountRow<T> {
  month: string;
}

export interface IActivityLifecycleRow extends ICountRow {
  upcoming: string;
  ongoing: string;
  completed: string;
}

export interface IActivityStatistics {
  total: number;
  lifecycle: {
    upcoming: number;
    ongoing: number;
    completed: number;
  };
  byType: INamedCount[];
}

export interface IUserStatistics {
  total: number;
  registrations: IMonthlyCount[];
  roles: INamedCount[];
}

export interface IProgramStatistics {
  total: number;
  byPortfolio: INamedCount[];
}

export interface IReviewStatistics {
  total: number;
  trend: IMonthlyCount[];
}

export interface IStatusStatistics<T> {
  total: number;
  byStatus: Array<{ name: T; total: number }>;
  trend: Array<IMonthlyCount & { status: T }>;
}

export type IParticipationStatistics = IStatusStatistics<ParticipationStatus>;
export type IVentureStatistics = IStatusStatistics<VentureStatus>;
