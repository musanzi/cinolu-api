import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';

export class ValidateCredentials extends Query<IUserResponse> {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {
    super();
  }
}
