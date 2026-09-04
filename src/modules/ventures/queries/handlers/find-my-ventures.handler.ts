import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parsePaginationParams } from '@/shared/helpers';
import { Venture } from '../../entities';
import { FindMyVentures } from '../impl';

@QueryHandler(FindMyVentures)
export class FindMyVenturesHandler implements IQueryHandler<FindMyVentures, [Venture[], number]> {
  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  execute(query: FindMyVentures): Promise<[Venture[], number]> {
    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository
      .createQueryBuilder('venture')
      .where('venture.ownerId = :ownerId', { ownerId: query.ownerId })
      .orderBy('venture.updatedAt', 'DESC');

    if (query.params.status) builder.andWhere('venture.status = :status', { status: query.params.status });
    if (query.params.q) builder.andWhere('venture.name ILIKE :q', { q: `%${query.params.q}%` });

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
