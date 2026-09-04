import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '../../interfaces';

export class FindUserByEmail extends Query<IUserResponse> {
  constructor(
    public readonly email: string,
    public readonly includePassword?: boolean
  ) {
    super();
  }
}
