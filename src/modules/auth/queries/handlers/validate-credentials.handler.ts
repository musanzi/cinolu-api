import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { compare } from 'bcryptjs';
import { IUserResponse } from '@/modules/users/interfaces';
import { ValidateCredentials } from '../impl';
import { FindUserByEmail } from '@/modules/users/queries';

@QueryHandler(ValidateCredentials)
export class ValidateCredentialsHandler implements IQueryHandler<ValidateCredentials, IUserResponse> {
  constructor(private readonly queryBus: QueryBus) {}

  async execute(query: ValidateCredentials): Promise<IUserResponse> {
    const unauthorized = new UnauthorizedException('Les identifiants saisis sont invalides');

    try {
      const user = await this.queryBus.execute(new FindUserByEmail(query.email, true));

      if (!user?.password) throw unauthorized;

      const isPasswordValid = await compare(query.password, user.password);
      if (!isPasswordValid) throw unauthorized;

      return await this.queryBus.execute(new FindUserByEmail(query.email));
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw unauthorized;
    }
  }
}
