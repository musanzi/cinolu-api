import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { SignIn } from '../impl';

@QueryHandler(SignIn)
export class SignInHandler implements IQueryHandler<SignIn, IUserResponse> {
  async execute(query: SignIn): Promise<IUserResponse> {
    return query.request['user'] as IUserResponse;
  }
}
