import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateCredentials } from '../queries';
import { IUserResponse } from '@/modules/users/interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly queryBus: QueryBus) {
    super({
      usernameField: 'email'
    });
  }

  async validate(email: string, password: string): Promise<IUserResponse> {
    return this.queryBus.execute(new ValidateCredentials(email, password));
  }
}
