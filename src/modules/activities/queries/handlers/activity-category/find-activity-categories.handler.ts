import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parsePaginationParams } from '@/shared/helpers';
import { ActivityCategory } from '../../../entities';
import { FindActivityCategories } from '../../impl';

@QueryHandler(FindActivityCategories)
export class FindActivityCategoriesHandler implements IQueryHandler<
  FindActivityCategories,
  [ActivityCategory[], number]
> {
  constructor(
    @InjectRepository(ActivityCategory)
    private readonly repository: Repository<ActivityCategory>
  ) {}

  execute(query: FindActivityCategories): Promise<[ActivityCategory[], number]> {
    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository
      .createQueryBuilder('activityCategory')
      .orderBy('activityCategory.updatedAt', 'DESC');

    if (query.params.q) builder.andWhere('activityCategory.name ILIKE :q', { q: `%${query.params.q}%` });

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
