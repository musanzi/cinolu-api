import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityReview } from '../../entities';
import { IReviewAdminStatistics } from '../../interfaces';
import { GetReviewAdminStatistics } from '../impl';

interface IMonthlyCountRow {
  month: string;
  total: string;
}

@QueryHandler(GetReviewAdminStatistics)
export class GetReviewAdminStatisticsHandler implements IQueryHandler<
  GetReviewAdminStatistics,
  IReviewAdminStatistics
> {
  constructor(@InjectRepository(ActivityReview) private readonly repository: Repository<ActivityReview>) {}

  async execute(query: GetReviewAdminStatistics): Promise<IReviewAdminStatistics> {
    const [total, trend] = await Promise.all([
      this.repository.count(),
      this.repository
        .createQueryBuilder('review')
        .select("TO_CHAR(DATE_TRUNC('month', review.submitDate AT TIME ZONE 'UTC'), 'YYYY-MM')", 'month')
        .addSelect('COUNT(review.id)', 'total')
        .where('review.submitDate >= :from', { from: query.from })
        .andWhere('review.submitDate < :to', { to: query.to })
        .groupBy("DATE_TRUNC('month', review.submitDate AT TIME ZONE 'UTC')")
        .orderBy("DATE_TRUNC('month', review.submitDate AT TIME ZONE 'UTC')", 'ASC')
        .getRawMany<IMonthlyCountRow>()
    ]);

    return {
      total,
      trend: trend.map((item) => ({ month: item.month, total: Number(item.total) }))
    };
  }
}
