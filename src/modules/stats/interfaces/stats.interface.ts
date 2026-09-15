import { ParticipationStatus } from '@/modules/participations/interfaces';
import { VentureStatus } from '@/modules/ventures/interfaces';

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
  byStatus: { name: T; total: number }[];
  trend: (IMonthlyCount & { status: T })[];
}

export interface IChartPoint {
  name: string;
  value: number;
}

export interface IChartSeries {
  name: string;
  series: IChartPoint[];
}

export interface IStatsKpi {
  key: string;
  label: string;
  value: number;
  unit: 'count' | 'percentage' | 'average';
  changePercentage?: number | null;
}

export interface IStatsPeriod {
  months: number;
  from: string;
  to: string;
}

export interface IDateRange {
  from: Date;
  to: Date;
  months: string[];
  period: IStatsPeriod;
}

export interface IStatsCharts {
  userRegistrations: IChartPoint[];
  participationStatuses: IChartPoint[];
  ventureStatuses: IChartPoint[];
  activitiesByType: IChartPoint[];
  programsByPortfolio: IChartPoint[];
}

export interface IStatsDashboard {
  generatedAt: string;
  period: IStatsPeriod;
  kpis: IStatsKpi[];
  charts: IStatsCharts;
}

export interface IUserStatsCharts {
  activity: IChartSeries[];
}

export interface IUserStatsDashboard {
  generatedAt: string;
  period: IStatsPeriod;
  kpis: IStatsKpi[];
  charts: IUserStatsCharts;
}

export interface IMonthlyCount {
  month: string;
  total: number;
}

export interface IMonthlyCountRow {
  month: string;
  total: string;
}

export interface INamedCount {
  name: string;
  total: number;
}

export interface IMonthlyStatistics {
  total: number;
  trend: IMonthlyCount[];
}

export type IParticipationStatistics = IStatusStatistics<ParticipationStatus>;
export type IVentureStatistics = IStatusStatistics<VentureStatus>;
