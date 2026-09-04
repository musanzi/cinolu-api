import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parsePaginationParams } from '@/shared/helpers';
import { ActivityType } from '../../../entities';
import { FindActivityTypes } from '../../impl';

@QueryHandler(FindActivityTypes)
export class FindActivityTypesHandler implements IQueryHandler<FindActivityTypes, [ActivityType[], number]> {
  constructor(
    @InjectRepository(ActivityType)
    private readonly repository: Repository<ActivityType>
  ) {}

  execute(query: FindActivityTypes): Promise<[ActivityType[], number]> {
    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository.createQueryBuilder('activityType').orderBy('activityType.updatedAt', 'DESC');

    if (query.params.q) builder.andWhere('activityType.name ILIKE :q', { q: `%${query.params.q}%` });

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
