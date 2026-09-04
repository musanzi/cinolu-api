import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../../entities';
import { IActivityAdminStatistics } from '../../../interfaces';
import { GetActivityAdminStatistics } from '../../impl';

interface ILifecycleRow {
  total: string;
  upcoming: string;
  ongoing: string;
  completed: string;
}

interface IActivityTypeCountRow {
  name: string;
  total: string;
}

@QueryHandler(GetActivityAdminStatistics)
export class GetActivityAdminStatisticsHandler implements IQueryHandler<
  GetActivityAdminStatistics,
  IActivityAdminStatistics
> {
  constructor(@InjectRepository(Activity) private readonly repository: Repository<Activity>) {}

  async execute(query: GetActivityAdminStatistics): Promise<IActivityAdminStatistics> {
    const [lifecycle, byType] = await Promise.all([
      this.repository
        .createQueryBuilder('activity')
        .select('COUNT(activity.id)', 'total')
        .addSelect('COUNT(activity.id) FILTER (WHERE activity.startDate > :asOf)', 'upcoming')
        .addSelect(
          'COUNT(activity.id) FILTER (WHERE activity.startDate <= :asOf AND activity.endDate >= :asOf)',
          'ongoing'
        )
        .addSelect('COUNT(activity.id) FILTER (WHERE activity.endDate < :asOf)', 'completed')
        .setParameter('asOf', query.asOf)
        .getRawOne<ILifecycleRow>(),
      this.repository
        .createQueryBuilder('activity')
        .innerJoin('activity.type', 'type')
        .select('type.name', 'name')
        .addSelect('COUNT(activity.id)', 'total')
        .groupBy('type.id')
        .addGroupBy('type.name')
        .orderBy('COUNT(activity.id)', 'DESC')
        .getRawMany<IActivityTypeCountRow>()
    ]);

    return {
      total: Number(lifecycle?.total ?? 0),
      lifecycle: {
        upcoming: Number(lifecycle?.upcoming ?? 0),
        ongoing: Number(lifecycle?.ongoing ?? 0),
        completed: Number(lifecycle?.completed ?? 0)
      },
      byType: byType.map((item) => ({ name: item.name, total: Number(item.total) }))
    };
  }
}
