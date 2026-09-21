import { ApiProperty } from '@nestjs/swagger';

export class ChartPointDto {
  @ApiProperty({ example: '2026-08' })
  name: string;

  @ApiProperty({ example: 12 })
  value: number;
}

export class ChartSeriesDto {
  @ApiProperty({ example: 'Participations' })
  name: string;

  @ApiProperty({ type: [ChartPointDto] })
  series: ChartPointDto[];
}

export class StatsPeriodDto {
  @ApiProperty({ example: 12 })
  months: number;

  @ApiProperty({ format: 'date-time' })
  from: string;

  @ApiProperty({ format: 'date-time' })
  to: string;
}

export class StatsKpiDto {
  @ApiProperty({ example: 'users' })
  key: string;

  @ApiProperty({ example: 'Utilisateurs' })
  label: string;

  @ApiProperty({ example: 128 })
  value: number;

  @ApiProperty({ enum: ['count', 'percentage', 'average'], example: 'count' })
  unit: 'count' | 'percentage' | 'average';

  @ApiProperty({ example: 12.5, nullable: true })
  changePercentage?: number | null;
}

export class StatsChartsDto {
  @ApiProperty({ type: [ChartPointDto] })
  userRegistrations: ChartPointDto[];

  @ApiProperty({ type: [ChartPointDto] })
  participationStatuses: ChartPointDto[];

  @ApiProperty({ type: [ChartPointDto] })
  ventureStatuses: ChartPointDto[];

  @ApiProperty({ type: [ChartPointDto] })
  activitiesByType: ChartPointDto[];

  @ApiProperty({ type: [ChartPointDto] })
  programsByPortfolio: ChartPointDto[];
}

export class StatsDashboardDto {
  @ApiProperty({ format: 'date-time' })
  generatedAt: string;

  @ApiProperty({ type: StatsPeriodDto })
  period: StatsPeriodDto;

  @ApiProperty({ type: [StatsKpiDto] })
  kpis: StatsKpiDto[];

  @ApiProperty({ type: StatsChartsDto })
  charts: StatsChartsDto;
}

export class UserStatsChartsDto {
  @ApiProperty({ type: [ChartSeriesDto] })
  activity: ChartSeriesDto[];
}

export class UserStatsDashboardDto {
  @ApiProperty({ format: 'date-time' })
  generatedAt: string;

  @ApiProperty({ type: StatsPeriodDto })
  period: StatsPeriodDto;

  @ApiProperty({ type: [StatsKpiDto] })
  kpis: StatsKpiDto[];

  @ApiProperty({ type: UserStatsChartsDto })
  charts: UserStatsChartsDto;
}
