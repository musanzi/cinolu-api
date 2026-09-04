import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parsePaginationParams } from '@/shared/helpers';
import { Venture } from '../../entities';
import { VentureStatus } from '../../interfaces';
import { FindPublishedVentures } from '../impl';

@QueryHandler(FindPublishedVentures)
export class FindPublishedVenturesHandler implements IQueryHandler<FindPublishedVentures, [Venture[], number]> {
  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  execute(query: FindPublishedVentures): Promise<[Venture[], number]> {
    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository
      .createQueryBuilder('venture')
      .where('venture.status = :status', { status: VentureStatus.PUBLISHED })
      .orderBy('venture.updatedAt', 'DESC');

    if (query.params.q) {
      builder.andWhere('(venture.name ILIKE :q OR venture.shortDescription ILIKE :q)', {
        q: `%${query.params.q}%`
      });
    }

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
