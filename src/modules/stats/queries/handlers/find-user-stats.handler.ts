import { Participation } from '@/modules/participations/entities';
import { Review } from '@/modules/reviews/entities';
import { Venture } from '@/modules/ventures/entities';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource, Repository } from 'typeorm';
import { createDateRange, fillMonthlySeries, monthOverMonth } from '../../helpers';
import { IMonthlyCountRow, IMonthlyStatistics, IUserStatsDashboard } from '../../interfaces';
import { FindUserStats } from '../impl';

@QueryHandler(FindUserStats)
export class FindUserStatsHandler implements IQueryHandler<FindUserStats, IUserStatsDashboard> {
  private readonly logger = new Logger(FindUserStatsHandler.name);
  private readonly participationRepository: Repository<Participation>;
  private readonly reviewRepository: Repository<Review>;
  private readonly ventureRepository: Repository<Venture>;

  constructor(dataSource: DataSource) {
    this.participationRepository = dataSource.getRepository(Participation);
    this.reviewRepository = dataSource.getRepository(Review);
    this.ventureRepository = dataSource.getRepository(Venture);
  }

  async execute(query: FindUserStats): Promise<IUserStatsDashboard> {
    const generatedAt = new Date();
    const range = createDateRange(query.months, generatedAt);

    try {
      const [participations, reviews, ventures] = await Promise.all([
        this.getStatistics(
          this.participationRepository,
          'participation',
          'participantId',
          query.userId,
          range.from,
          range.to
        ),
        this.getStatistics(this.reviewRepository, 'review', 'reviewerId', query.userId, range.from, range.to),
        this.getStatistics(this.ventureRepository, 'venture', 'ownerId', query.userId, range.from, range.to)
      ]);

      const activity = [
        fillMonthlySeries('Participations', range.months, participations.trend),
        fillMonthlySeries('Évaluations', range.months, reviews.trend),
        fillMonthlySeries('Initiatives', range.months, ventures.trend)
      ];

      return {
        generatedAt: generatedAt.toISOString(),
        period: range.period,
        kpis: [
          {
            key: 'participations',
            label: 'Participations',
            value: participations.total,
            unit: 'count',
            changePercentage: monthOverMonth(activity[0].series)
          },
          {
            key: 'reviews',
            label: 'Évaluations',
            value: reviews.total,
            unit: 'count',
            changePercentage: monthOverMonth(activity[1].series)
          },
          {
            key: 'ventures',
            label: 'Initiatives',
            value: ventures.total,
            unit: 'count',
            changePercentage: monthOverMonth(activity[2].series)
          }
        ],
        charts: { activity }
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const trace = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Find user stats failed userId="${query.userId}": ${message}`, trace);
      throw new InternalServerErrorException('Statistiques utilisateur introuvables');
    }
  }

  private async getStatistics<T extends Participation | Review | Venture>(
    repository: Repository<T>,
    alias: string,
    ownerColumn: string,
    userId: string,
    from: Date,
    to: Date
  ): Promise<IMonthlyStatistics> {
    const [total, trend] = await Promise.all([
      repository.createQueryBuilder(alias).where(`${alias}.${ownerColumn} = :userId`, { userId }).getCount(),
      repository
        .createQueryBuilder(alias)
        .select(`TO_CHAR(DATE_TRUNC('month', ${alias}.createdAt AT TIME ZONE 'UTC'), 'YYYY-MM')`, 'month')
        .addSelect(`COUNT(${alias}.id)`, 'total')
        .where(`${alias}.${ownerColumn} = :userId`, { userId })
        .andWhere(`${alias}.createdAt >= :from`, { from })
        .andWhere(`${alias}.createdAt < :to`, { to })
        .groupBy(`DATE_TRUNC('month', ${alias}.createdAt AT TIME ZONE 'UTC')`)
        .orderBy(`DATE_TRUNC('month', ${alias}.createdAt AT TIME ZONE 'UTC')`, 'ASC')
        .getRawMany<IMonthlyCountRow>()
    ]);

    return { total, trend: trend.map((item) => ({ month: item.month, total: Number(item.total) })) };
  }
}
