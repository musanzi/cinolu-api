import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venture } from '../../entities';
import { IVentureAdminStatistics, IVentureMonthlyStatusCountRow, IVentureStatusCountRow } from '../../interfaces';
import { GetVentureAdminStatistics } from '../impl';

@QueryHandler(GetVentureAdminStatistics)
export class GetVentureAdminStatisticsHandler implements IQueryHandler<
  GetVentureAdminStatistics,
  IVentureAdminStatistics
> {
  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  async execute(query: GetVentureAdminStatistics): Promise<IVentureAdminStatistics> {
    const [total, byStatus, trend] = await Promise.all([
      this.repository.count(),
      this.repository
        .createQueryBuilder('venture')
        .select('venture.status', 'status')
        .addSelect('COUNT(venture.id)', 'total')
        .groupBy('venture.status')
        .orderBy('COUNT(venture.id)', 'DESC')
        .getRawMany<IVentureStatusCountRow>(),
      this.repository
        .createQueryBuilder('venture')
        .select("TO_CHAR(DATE_TRUNC('month', venture.createdAt AT TIME ZONE 'UTC'), 'YYYY-MM')", 'month')
        .addSelect('venture.status', 'status')
        .addSelect('COUNT(venture.id)', 'total')
        .where('venture.createdAt >= :from', { from: query.from })
        .andWhere('venture.createdAt < :to', { to: query.to })
        .groupBy("DATE_TRUNC('month', venture.createdAt AT TIME ZONE 'UTC')")
        .addGroupBy('venture.status')
        .orderBy("DATE_TRUNC('month', venture.createdAt AT TIME ZONE 'UTC')", 'ASC')
        .getRawMany<IVentureMonthlyStatusCountRow>()
    ]);

    return {
      total,
      byStatus: byStatus.map((item) => ({ name: item.status, total: Number(item.total) })),
      trend: trend.map((item) => ({ month: item.month, status: item.status, total: Number(item.total) }))
    };
  }
}
