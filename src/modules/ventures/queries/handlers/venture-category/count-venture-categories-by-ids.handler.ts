import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentureCategory } from '../../../entities';
import { CountVentureCategoriesByIds } from '../../impl';

@QueryHandler(CountVentureCategoriesByIds)
export class CountVentureCategoriesByIdsHandler implements IQueryHandler<CountVentureCategoriesByIds, number> {
  constructor(
    @InjectRepository(VentureCategory)
    private readonly repository: Repository<VentureCategory>
  ) {}

  execute(query: CountVentureCategoriesByIds): Promise<number> {
    if (!query.ids.length) return Promise.resolve(0);

    return this.repository
      .createQueryBuilder('ventureCategory')
      .where('ventureCategory.id IN (:...ids)', { ids: query.ids })
      .getCount();
  }
}
