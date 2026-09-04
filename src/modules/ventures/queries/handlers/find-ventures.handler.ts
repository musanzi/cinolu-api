import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parsePaginationParams } from '@/shared/helpers';
import { Venture } from '../../entities';
import { FindVentures } from '../impl';

@QueryHandler(FindVentures)
export class FindVenturesHandler implements IQueryHandler<FindVentures, [Venture[], number]> {
  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  execute(query: FindVentures): Promise<[Venture[], number]> {
    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository
      .createQueryBuilder('venture')
      .leftJoinAndSelect('venture.owner', 'owner')
      .orderBy('venture.updatedAt', 'DESC');

    if (query.params.status) builder.andWhere('venture.status = :status', { status: query.params.status });
    if (query.params.q) {
      builder.andWhere('(venture.name ILIKE :q OR owner.name ILIKE :q OR owner.email ILIKE :q)', {
        q: `%${query.params.q}%`
      });
    }

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
