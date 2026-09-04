import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { GetProfile } from '../impl';
import { FindUserByEmail } from '@/modules/users/queries';

@QueryHandler(GetProfile)
export class ProfileHandler implements IQueryHandler<GetProfile, IUserResponse> {
  constructor(private readonly queryBus: QueryBus) {}

  async execute(query: GetProfile): Promise<IUserResponse> {
    return await this.queryBus.execute(new FindUserByEmail(query.email));
  }
}
