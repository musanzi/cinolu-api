/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */

export interface StatsDashboard {
  generatedAt: string;
  period: { months: number; from: string; to: string };
  kpis: Array<{
    key: string;
    label: string;
    value: number;
    unit: 'count' | 'percentage' | 'average';
    changePercentage?: number | null;
  }>;
  charts: {
    userRegistrations: Array<{ name: string; value: number }>;
    participationTrend: Array<{ name: string; series: Array<{ name: string; value: number }> }>;
    reviewTrend: Array<{ name: string; value: number }>;
    ventureTrend: Array<{ name: string; series: Array<{ name: string; value: number }> }>;
    activityLifecycle: Array<{ name: string; value: number }>;
    participationStatuses: Array<{ name: string; value: number }>;
    ventureStatuses: Array<{ name: string; value: number }>;
    activitiesByType: Array<{ name: string; value: number }>;
    programsByPortfolio: Array<{ name: string; value: number }>;
    usersByRole: Array<{ name: string; value: number }>;
  };
}

export interface StatsQuery {
  months?: number | string; /* integer 3..24; default 12 */
}
