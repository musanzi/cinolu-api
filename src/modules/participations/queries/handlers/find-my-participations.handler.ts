import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parsePaginationParams } from '@/shared/helpers';
import { ActivityParticipation } from '../../entities/activity-participation.entity';
import { FindMyParticipations } from '../impl';

@QueryHandler(FindMyParticipations)
export class FindMyParticipationsHandler implements IQueryHandler<
  FindMyParticipations,
  [ActivityParticipation[], number]
> {
  constructor(
    @InjectRepository(ActivityParticipation)
    private readonly repository: Repository<ActivityParticipation>
  ) {}

  execute(query: FindMyParticipations): Promise<[ActivityParticipation[], number]> {
    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository
      .createQueryBuilder('participation')
      .leftJoinAndSelect('participation.activity', 'activity')
      .where('participation.userId = :userId', { userId: query.userId })
      .orderBy('participation.submitDate', 'DESC');

    if (query.params.status) builder.andWhere('participation.status = :status', { status: query.params.status });

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
