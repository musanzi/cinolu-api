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

export interface IStatsCharts {
  userRegistrations: IChartPoint[];
  participationTrend: IChartSeries[];
  reviewTrend: IChartPoint[];
  ventureTrend: IChartSeries[];
  activityLifecycle: IChartPoint[];
  participationStatuses: IChartPoint[];
  ventureStatuses: IChartPoint[];
  activitiesByType: IChartPoint[];
  programsByPortfolio: IChartPoint[];
  usersByRole: IChartPoint[];
}

export interface IStatsDashboard {
  generatedAt: string;
  period: IStatsPeriod;
  kpis: IStatsKpi[];
  charts: IStatsCharts;
}
