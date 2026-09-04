import { IMonthlyCount } from '@/shared/interfaces';
import { IChartPoint, IChartSeries, IStatsPeriod } from '../interfaces';

export interface IDateRange {
  from: Date;
  to: Date;
  months: string[];
  period: IStatsPeriod;
}

export function createDateRange(monthCount: number, now: Date): IDateRange {
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthCount + 1, 1));
  const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const months = Array.from({ length: monthCount }, (_, index) => {
    const date = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + index, 1));
    return date.toISOString().slice(0, 7);
  });

  return {
    from,
    to,
    months,
    period: {
      months: monthCount,
      from: from.toISOString(),
      to: to.toISOString()
    }
  };
}

export function fillMonthlyChart(months: string[], values: IMonthlyCount[]): IChartPoint[] {
  const totals = new Map(values.map((item) => [item.month, item.total]));
  return months.map((month) => ({ name: month, value: totals.get(month) ?? 0 }));
}

export function fillMonthlySeries(name: string, months: string[], values: IMonthlyCount[]): IChartSeries {
  return { name, series: fillMonthlyChart(months, values) };
}

export function percentage(part: number, total: number): number {
  if (!total) return 0;
  return Number(((part / total) * 100).toFixed(1));
}

export function average(total: number, divisor: number): number {
  if (!divisor) return 0;
  return Number((total / divisor).toFixed(1));
}

export function monthOverMonth(series: IChartPoint[]): number | null {
  const [previous, current] = series.slice(-2);
  if (!previous || !current) return null;
  if (!previous.value) return current.value ? null : 0;
  return Number((((current.value - previous.value) / previous.value) * 100).toFixed(1));
}
