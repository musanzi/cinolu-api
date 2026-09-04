import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';
import { IUserAdminStatistics } from '../../interfaces';
import { GetUserAdminStatistics } from '../impl';

interface IMonthlyCountRow {
  month: string;
  total: string;
}

interface IRoleCountRow {
  name: string;
  total: string;
}

@QueryHandler(GetUserAdminStatistics)
export class GetUserAdminStatisticsHandler implements IQueryHandler<GetUserAdminStatistics, IUserAdminStatistics> {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  async execute(query: GetUserAdminStatistics): Promise<IUserAdminStatistics> {
    const [total, registrations, roles] = await Promise.all([
      this.repository.count(),
      this.repository
        .createQueryBuilder('user')
        .select("TO_CHAR(DATE_TRUNC('month', user.createdAt AT TIME ZONE 'UTC'), 'YYYY-MM')", 'month')
        .addSelect('COUNT(user.id)', 'total')
        .where('user.createdAt >= :from', { from: query.from })
        .andWhere('user.createdAt < :to', { to: query.to })
        .groupBy("DATE_TRUNC('month', user.createdAt AT TIME ZONE 'UTC')")
        .orderBy("DATE_TRUNC('month', user.createdAt AT TIME ZONE 'UTC')", 'ASC')
        .getRawMany<IMonthlyCountRow>(),
      this.repository
        .createQueryBuilder('user')
        .innerJoin('user.roles', 'role')
        .select('role.name', 'name')
        .addSelect('COUNT(DISTINCT user.id)', 'total')
        .groupBy('role.id')
        .addGroupBy('role.name')
        .orderBy('COUNT(DISTINCT user.id)', 'DESC')
        .getRawMany<IRoleCountRow>()
    ]);

    return {
      total,
      registrations: registrations.map((item) => ({ month: item.month, total: Number(item.total) })),
      roles: roles.map((item) => ({ name: item.name, total: Number(item.total) }))
    };
  }
}
