import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetActivityAdminStatistics } from '@/modules/activities/queries';
import { GetParticipationAdminStatistics } from '@/modules/participations/queries';
import { ParticipationStatus } from '@/modules/participations/interfaces';
import { GetProgramAdminStatistics } from '@/modules/programs/queries';
import { GetReviewAdminStatistics } from '@/modules/reviews/queries';
import { GetUserAdminStatistics } from '@/modules/users/queries';
import { VentureStatus } from '@/modules/ventures/interfaces';
import { GetVentureAdminStatistics } from '@/modules/ventures/queries';
import { IMonthlyCount } from '@/shared/interfaces';
import {
  average,
  createDateRange,
  fillMonthlyChart,
  fillMonthlySeries,
  monthOverMonth,
  percentage
} from '../../helpers';
import { IStatsDashboard } from '../../interfaces';
import { FindStats } from '../impl';

const participationLabels: Record<ParticipationStatus, string> = {
  [ParticipationStatus.PENDING]: 'En attente',
  [ParticipationStatus.APPROVED]: 'Approuvées',
  [ParticipationStatus.CANCELLED]: 'Annulées'
};

const ventureLabels: Record<VentureStatus, string> = {
  [VentureStatus.DRAFT]: 'Brouillons',
  [VentureStatus.PUBLISHED]: 'Publiées',
  [VentureStatus.REJECTED]: 'Rejetées'
};

@QueryHandler(FindStats)
export class FindStatsHandler implements IQueryHandler<FindStats, IStatsDashboard> {
  private readonly logger = new Logger(FindStatsHandler.name);

  constructor(private readonly queryBus: QueryBus) {}

  async execute(query: FindStats): Promise<IStatsDashboard> {
    const generatedAt = new Date();
    const range = createDateRange(query.months, generatedAt);

    try {
      const [users, programs, activities, participations, reviews, ventures] = await Promise.all([
        this.queryBus.execute(new GetUserAdminStatistics(range.from, range.to)),
        this.queryBus.execute(new GetProgramAdminStatistics()),
        this.queryBus.execute(new GetActivityAdminStatistics(generatedAt)),
        this.queryBus.execute(new GetParticipationAdminStatistics(range.from, range.to)),
        this.queryBus.execute(new GetReviewAdminStatistics(range.from, range.to)),
        this.queryBus.execute(new GetVentureAdminStatistics(range.from, range.to))
      ]);

      const userRegistrations = fillMonthlyChart(range.months, users.registrations);
      const reviewTrend = fillMonthlyChart(range.months, reviews.trend);
      const participationMonthlyTotals = this.sumParticipationMonths(participations.trend);
      const participationStatuses = new Map(participations.byStatus.map((item) => [item.name, item.total]));
      const approved = participationStatuses.get(ParticipationStatus.APPROVED) ?? 0;
      const ventureMonthlyTotals = this.sumStatusMonths(ventures.trend);
      const ventureStatuses = new Map(ventures.byStatus.map((item) => [item.name, item.total]));

      return {
        generatedAt: generatedAt.toISOString(),
        period: range.period,
        kpis: [
          {
            key: 'users',
            label: 'Utilisateurs',
            value: users.total,
            unit: 'count',
            changePercentage: monthOverMonth(userRegistrations)
          },
          { key: 'programs', label: 'Programmes', value: programs.total, unit: 'count' },
          { key: 'activities', label: 'Activités', value: activities.total, unit: 'count' },
          {
            key: 'ventures',
            label: 'Initiatives',
            value: ventures.total,
            unit: 'count',
            changePercentage: monthOverMonth(fillMonthlyChart(range.months, ventureMonthlyTotals))
          },
          {
            key: 'participations',
            label: 'Participations',
            value: participations.total,
            unit: 'count',
            changePercentage: monthOverMonth(fillMonthlyChart(range.months, participationMonthlyTotals))
          },
          {
            key: 'reviews',
            label: 'Avis',
            value: reviews.total,
            unit: 'count',
            changePercentage: monthOverMonth(reviewTrend)
          },
          {
            key: 'approvalRate',
            label: "Taux d'approbation",
            value: percentage(approved, participations.total),
            unit: 'percentage'
          },
          {
            key: 'participationsPerActivity',
            label: 'Participations par activité',
            value: average(participations.total, activities.total),
            unit: 'average'
          },
          {
            key: 'activityCompletionRate',
            label: "Taux d'activités terminées",
            value: percentage(activities.lifecycle.completed, activities.total),
            unit: 'percentage'
          }
        ],
        charts: {
          userRegistrations,
          participationTrend: Object.values(ParticipationStatus).map((status) =>
            fillMonthlySeries(
              participationLabels[status],
              range.months,
              participations.trend.filter((item) => item.status === status)
            )
          ),
          reviewTrend,
          ventureTrend: Object.values(VentureStatus).map((status) =>
            fillMonthlySeries(
              ventureLabels[status],
              range.months,
              ventures.trend.filter((item) => item.status === status)
            )
          ),
          activityLifecycle: [
            { name: 'À venir', value: activities.lifecycle.upcoming },
            { name: 'En cours', value: activities.lifecycle.ongoing },
            { name: 'Terminées', value: activities.lifecycle.completed }
          ],
          participationStatuses: Object.values(ParticipationStatus).map((status) => ({
            name: participationLabels[status],
            value: participationStatuses.get(status) ?? 0
          })),
          ventureStatuses: Object.values(VentureStatus).map((status) => ({
            name: ventureLabels[status],
            value: ventureStatuses.get(status) ?? 0
          })),
          activitiesByType: activities.byType.map((item) => ({ name: item.name, value: item.total })),
          programsByPortfolio: programs.byPortfolio.map((item) => ({ name: item.name, value: item.total })),
          usersByRole: users.roles.map((item) => ({ name: item.name, value: item.total }))
        }
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const trace = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Find stats failed: ${message}`, trace);
      throw new InternalServerErrorException('Statistiques introuvables');
    }
  }

  private sumParticipationMonths(values: Array<IMonthlyCount & { status: ParticipationStatus }>): IMonthlyCount[] {
    return this.sumStatusMonths(values);
  }

  private sumStatusMonths(values: IMonthlyCount[]): IMonthlyCount[] {
    const totals = new Map<string, number>();
    values.forEach((item) => totals.set(item.month, (totals.get(item.month) ?? 0) + item.total));
    return Array.from(totals, ([month, total]) => ({ month, total }));
  }
}
