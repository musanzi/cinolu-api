import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityCategory } from '../../../entities';
import { CountActivityCategoriesByIds } from '../../impl';

@QueryHandler(CountActivityCategoriesByIds)
export class CountActivityCategoriesByIdsHandler implements IQueryHandler<CountActivityCategoriesByIds, number> {
  constructor(
    @InjectRepository(ActivityCategory)
    private readonly repository: Repository<ActivityCategory>
  ) {}

  execute(query: CountActivityCategoriesByIds): Promise<number> {
    if (!query.ids.length) return Promise.resolve(0);

    return this.repository
      .createQueryBuilder('activityCategory')
      .where('activityCategory.id IN (:...ids)', { ids: query.ids })
      .getCount();
  }
}
