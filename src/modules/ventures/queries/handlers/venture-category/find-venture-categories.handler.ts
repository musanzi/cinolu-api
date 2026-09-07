import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parsePaginationParams } from '@/shared/helpers';
import { VentureCategory } from '../../../entities';
import { FindVentureCategories } from '../../impl';

@QueryHandler(FindVentureCategories)
export class FindVentureCategoriesHandler implements IQueryHandler<FindVentureCategories, [VentureCategory[], number]> {
  constructor(
    @InjectRepository(VentureCategory)
    private readonly repository: Repository<VentureCategory>
  ) {}

  execute(query: FindVentureCategories): Promise<[VentureCategory[], number]> {
    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository.createQueryBuilder('ventureCategory').orderBy('ventureCategory.updatedAt', 'DESC');

    if (query.params.q) builder.andWhere('ventureCategory.name ILIKE :q', { q: `%${query.params.q}%` });

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
