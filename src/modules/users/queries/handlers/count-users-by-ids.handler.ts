import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CountUsersByIds } from '../impl';

@QueryHandler(CountUsersByIds)
export class CountUsersByIdsHandler implements IQueryHandler<CountUsersByIds, number> {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  execute(query: CountUsersByIds): Promise<number> {
    if (!query.ids.length) return Promise.resolve(0);
    return this.repository.createQueryBuilder('user').where('user.id IN (:...ids)', { ids: query.ids }).getCount();
  }
}
