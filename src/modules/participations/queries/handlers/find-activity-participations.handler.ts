import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindManagedActivityById } from '@/modules/activities/queries';
import { parsePaginationParams } from '@/shared/helpers';
import { ActivityParticipation } from '../../entities/activity-participation.entity';
import { FindActivityParticipations } from '../impl';

@QueryHandler(FindActivityParticipations)
export class FindActivityParticipationsHandler implements IQueryHandler<
  FindActivityParticipations,
  [ActivityParticipation[], number]
> {
  constructor(
    @InjectRepository(ActivityParticipation)
    private readonly repository: Repository<ActivityParticipation>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(query: FindActivityParticipations): Promise<[ActivityParticipation[], number]> {
    await this.queryBus.execute(new FindManagedActivityById(query.actor, query.activityId));

    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository
      .createQueryBuilder('participation')
      .leftJoinAndSelect('participation.user', 'user')
      .where('participation.activityId = :activityId', { activityId: query.activityId })
      .orderBy('participation.submitDate', 'DESC');

    if (query.params.status) builder.andWhere('participation.status = :status', { status: query.params.status });
    if (query.params.q) builder.andWhere('(user.name ILIKE :q OR user.email ILIKE :q)', { q: `%${query.params.q}%` });

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
