import { Activity } from '@/modules/activities/entities';
import { Participation } from '@/modules/participations/entities';
import { ParticipationStatus } from '@/modules/participations/interfaces';
import { Program } from '@/modules/programs/entities';
import { Review } from '@/modules/reviews/entities';
import { User } from '@/modules/users/entities';
import { Venture } from '@/modules/ventures/entities';
import { VentureStatus } from '@/modules/ventures/interfaces';
import { IMonthlyCount, INamedCount } from '@/shared/interfaces';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource, Repository } from 'typeorm';
import { createDateRange, fillMonthlyChart, monthOverMonth, sumMonthlyCounts } from '../../helpers';
import {
  IActivityLifecycleRow,
  IActivityStatistics,
  IMonthlyCountRow,
  IMonthlyStatusCountRow,
  INamedCountRow,
  IParticipationStatistics,
  IProgramStatistics,
  IReviewStatistics,
  IStatsDashboard,
  IStatusCountRow,
  IUserStatistics,
  IVentureStatistics
} from '../../interfaces';
import { FindStats } from '../impl';

const participationLabels: Record<ParticipationStatus, string> = {
  [ParticipationStatus.PENDING]: 'En attente',
  [ParticipationStatus.APPROVED]: 'Approuvées',
  [ParticipationStatus.DECLINED]: 'Refusées'
};

const ventureLabels: Record<VentureStatus, string> = {
  [VentureStatus.PENDING]: 'En attente',
  [VentureStatus.APPROVED]: 'Approuvées',
  [VentureStatus.REJECTED]: 'Rejetées'
};

@QueryHandler(FindStats)
export class FindStatsHandler implements IQueryHandler<FindStats, IStatsDashboard> {
  private readonly logger = new Logger(FindStatsHandler.name);
  private readonly userRepository: Repository<User>;
  private readonly programRepository: Repository<Program>;
  private readonly activityRepository: Repository<Activity>;
  private readonly participationRepository: Repository<Participation>;
  private readonly reviewRepository: Repository<Review>;
  private readonly ventureRepository: Repository<Venture>;

  constructor(dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(User);
    this.programRepository = dataSource.getRepository(Program);
    this.activityRepository = dataSource.getRepository(Activity);
    this.participationRepository = dataSource.getRepository(Participation);
    this.reviewRepository = dataSource.getRepository(Review);
    this.ventureRepository = dataSource.getRepository(Venture);
  }

  async execute(query: FindStats): Promise<IStatsDashboard> {
    const generatedAt = new Date();
    const range = createDateRange(query.months, generatedAt);

    try {
      const [users, programs, activities, participations, ventures] = await Promise.all([
        this.getUserStatistics(range.from, range.to),
        this.getProgramStatistics(),
        this.getActivityStatistics(generatedAt),
        this.getParticipationStatistics(range.from, range.to),
        this.getVentureStatistics(range.from, range.to)
      ]);

      const userRegistrations = fillMonthlyChart(range.months, users.registrations);
      const participationTrend = fillMonthlyChart(range.months, sumMonthlyCounts(participations.trend));
      const ventureTrend = fillMonthlyChart(range.months, sumMonthlyCounts(ventures.trend));
      const participationStatuses = new Map(participations.byStatus.map((item) => [item.name, item.total]));
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
          {
            key: 'ventures',
            label: 'Initiatives',
            value: ventures.total,
            unit: 'count',
            changePercentage: monthOverMonth(ventureTrend)
          },
          {
            key: 'participations',
            label: 'Participations',
            value: participations.total,
            unit: 'count',
            changePercentage: monthOverMonth(participationTrend)
          }
        ],
        charts: {
          userRegistrations,
          participationStatuses: Object.values(ParticipationStatus).map((status) => ({
            name: participationLabels[status],
            value: participationStatuses.get(status) ?? 0
          })),
          ventureStatuses: Object.values(VentureStatus).map((status) => ({
            name: ventureLabels[status],
            value: ventureStatuses.get(status) ?? 0
          })),
          activitiesByType: activities.byType.map((item) => ({ name: item.name, value: item.total })),
          programsByPortfolio: programs.byPortfolio.map((item) => ({ name: item.name, value: item.total }))
        }
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const trace = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Find stats failed: ${message}`, trace);
      throw new InternalServerErrorException('Statistiques introuvables');
    }
  }

  private async getUserStatistics(from: Date, to: Date): Promise<IUserStatistics> {
    const [total, registrations, roles] = await Promise.all([
      this.userRepository.count(),
      this.userRepository
        .createQueryBuilder('user')
        .select("TO_CHAR(DATE_TRUNC('month', user.createdAt AT TIME ZONE 'UTC'), 'YYYY-MM')", 'month')
        .addSelect('COUNT(user.id)', 'total')
        .where('user.createdAt >= :from', { from })
        .andWhere('user.createdAt < :to', { to })
        .groupBy("DATE_TRUNC('month', user.createdAt AT TIME ZONE 'UTC')")
        .orderBy("DATE_TRUNC('month', user.createdAt AT TIME ZONE 'UTC')", 'ASC')
        .getRawMany<IMonthlyCountRow>(),
      this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.roles', 'role')
        .select('role.name', 'name')
        .addSelect('COUNT(DISTINCT user.id)', 'total')
        .groupBy('role.id')
        .addGroupBy('role.name')
        .orderBy('COUNT(DISTINCT user.id)', 'DESC')
        .getRawMany<INamedCountRow>()
    ]);

    return {
      total,
      registrations: this.toMonthlyCounts(registrations),
      roles: this.toNamedCounts(roles)
    };
  }

  private async getProgramStatistics(): Promise<IProgramStatistics> {
    const [total, byPortfolio] = await Promise.all([
      this.programRepository.count(),
      this.programRepository
        .createQueryBuilder('program')
        .innerJoin('program.portfolio', 'portfolio')
        .select('portfolio.name', 'name')
        .addSelect('COUNT(program.id)', 'total')
        .groupBy('portfolio.id')
        .addGroupBy('portfolio.name')
        .orderBy('COUNT(program.id)', 'DESC')
        .getRawMany<INamedCountRow>()
    ]);

    return { total, byPortfolio: this.toNamedCounts(byPortfolio) };
  }

  private async getActivityStatistics(asOf: Date): Promise<IActivityStatistics> {
    const [lifecycle, byType] = await Promise.all([
      this.activityRepository
        .createQueryBuilder('activity')
        .select('COUNT(activity.id)', 'total')
        .addSelect('COUNT(activity.id) FILTER (WHERE activity.startDate > :asOf)', 'upcoming')
        .addSelect(
          'COUNT(activity.id) FILTER (WHERE activity.startDate <= :asOf AND activity.endDate >= :asOf)',
          'ongoing'
        )
        .addSelect('COUNT(activity.id) FILTER (WHERE activity.endDate < :asOf)', 'completed')
        .setParameter('asOf', asOf)
        .getRawOne<IActivityLifecycleRow>(),
      this.activityRepository
        .createQueryBuilder('activity')
        .innerJoin('activity.types', 'type')
        .select('type.name', 'name')
        .addSelect('COUNT(DISTINCT activity.id)', 'total')
        .groupBy('type.id')
        .addGroupBy('type.name')
        .orderBy('COUNT(DISTINCT activity.id)', 'DESC')
        .getRawMany<INamedCountRow>()
    ]);

    return {
      total: Number(lifecycle?.total ?? 0),
      byType: this.toNamedCounts(byType)
    };
  }

  private async getParticipationStatistics(from: Date, to: Date): Promise<IParticipationStatistics> {
    const [total, byStatus, trend] = await Promise.all([
      this.participationRepository.count(),
      this.participationRepository
        .createQueryBuilder('participation')
        .select('participation.status', 'status')
        .addSelect('COUNT(participation.id)', 'total')
        .groupBy('participation.status')
        .orderBy('COUNT(participation.id)', 'DESC')
        .getRawMany<IStatusCountRow<ParticipationStatus>>(),
      this.monthlyStatusQuery(this.participationRepository, 'participation', from, to).getRawMany<
        IMonthlyStatusCountRow<ParticipationStatus>
      >()
    ]);

    return {
      total,
      byStatus: byStatus.map((item) => ({ name: item.status, total: Number(item.total) })),
      trend: trend.map((item) => ({ month: item.month, status: item.status, total: Number(item.total) }))
    };
  }

  private async getReviewStatistics(from: Date, to: Date): Promise<IReviewStatistics> {
    const [total, trend] = await Promise.all([
      this.reviewRepository.count(),
      this.reviewRepository
        .createQueryBuilder('review')
        .select("TO_CHAR(DATE_TRUNC('month', review.createdAt AT TIME ZONE 'UTC'), 'YYYY-MM')", 'month')
        .addSelect('COUNT(review.id)', 'total')
        .where('review.createdAt >= :from', { from })
        .andWhere('review.createdAt < :to', { to })
        .groupBy("DATE_TRUNC('month', review.createdAt AT TIME ZONE 'UTC')")
        .orderBy("DATE_TRUNC('month', review.createdAt AT TIME ZONE 'UTC')", 'ASC')
        .getRawMany<IMonthlyCountRow>()
    ]);

    return { total, trend: this.toMonthlyCounts(trend) };
  }

  private async getVentureStatistics(from: Date, to: Date): Promise<IVentureStatistics> {
    const [total, byStatus, trend] = await Promise.all([
      this.ventureRepository.count(),
      this.ventureRepository
        .createQueryBuilder('venture')
        .select('venture.status', 'status')
        .addSelect('COUNT(venture.id)', 'total')
        .groupBy('venture.status')
        .orderBy('COUNT(venture.id)', 'DESC')
        .getRawMany<IStatusCountRow<VentureStatus>>(),
      this.monthlyStatusQuery(this.ventureRepository, 'venture', from, to).getRawMany<
        IMonthlyStatusCountRow<VentureStatus>
      >()
    ]);

    return {
      total,
      byStatus: byStatus.map((item) => ({ name: item.status, total: Number(item.total) })),
      trend: trend.map((item) => ({ month: item.month, status: item.status, total: Number(item.total) }))
    };
  }

  private monthlyStatusQuery<T extends Participation | Venture>(
    repository: Repository<T>,
    alias: string,
    from: Date,
    to: Date
  ) {
    return repository
      .createQueryBuilder(alias)
      .select(`TO_CHAR(DATE_TRUNC('month', ${alias}.createdAt AT TIME ZONE 'UTC'), 'YYYY-MM')`, 'month')
      .addSelect(`${alias}.status`, 'status')
      .addSelect(`COUNT(${alias}.id)`, 'total')
      .where(`${alias}.createdAt >= :from`, { from })
      .andWhere(`${alias}.createdAt < :to`, { to })
      .groupBy(`DATE_TRUNC('month', ${alias}.createdAt AT TIME ZONE 'UTC')`)
      .addGroupBy(`${alias}.status`)
      .orderBy(`DATE_TRUNC('month', ${alias}.createdAt AT TIME ZONE 'UTC')`, 'ASC');
  }

  private toMonthlyCounts(rows: IMonthlyCountRow[]): IMonthlyCount[] {
    return rows.map((item) => ({ month: item.month, total: Number(item.total) }));
  }

  private toNamedCounts(rows: INamedCountRow[]): INamedCount[] {
    return rows.map((item) => ({ name: item.name, total: Number(item.total) }));
  }
}
