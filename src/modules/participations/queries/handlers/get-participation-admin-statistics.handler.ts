import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityParticipation } from '../../entities';
import { IParticipationAdminStatistics, ParticipationStatus } from '../../interfaces';
import { GetParticipationAdminStatistics } from '../impl';

interface IStatusCountRow {
  status: ParticipationStatus;
  total: string;
}

interface IMonthlyStatusCountRow extends IStatusCountRow {
  month: string;
}

@QueryHandler(GetParticipationAdminStatistics)
export class GetParticipationAdminStatisticsHandler implements IQueryHandler<
  GetParticipationAdminStatistics,
  IParticipationAdminStatistics
> {
  constructor(
    @InjectRepository(ActivityParticipation) private readonly repository: Repository<ActivityParticipation>
  ) {}

  async execute(query: GetParticipationAdminStatistics): Promise<IParticipationAdminStatistics> {
    const [total, byStatus, trend] = await Promise.all([
      this.repository.count(),
      this.repository
        .createQueryBuilder('participation')
        .select('participation.status', 'status')
        .addSelect('COUNT(participation.id)', 'total')
        .groupBy('participation.status')
        .orderBy('COUNT(participation.id)', 'DESC')
        .getRawMany<IStatusCountRow>(),
      this.repository
        .createQueryBuilder('participation')
        .select("TO_CHAR(DATE_TRUNC('month', participation.submitDate AT TIME ZONE 'UTC'), 'YYYY-MM')", 'month')
        .addSelect('participation.status', 'status')
        .addSelect('COUNT(participation.id)', 'total')
        .where('participation.submitDate >= :from', { from: query.from })
        .andWhere('participation.submitDate < :to', { to: query.to })
        .groupBy("DATE_TRUNC('month', participation.submitDate AT TIME ZONE 'UTC')")
        .addGroupBy('participation.status')
        .orderBy("DATE_TRUNC('month', participation.submitDate AT TIME ZONE 'UTC')", 'ASC')
        .getRawMany<IMonthlyStatusCountRow>()
    ]);

    return {
      total,
      byStatus: byStatus.map((item) => ({ name: item.status, total: Number(item.total) })),
      trend: trend.map((item) => ({ month: item.month, status: item.status, total: Number(item.total) }))
    };
  }
}
