import { IUserResponse } from '@/modules/users/interfaces';
import { FindUserById } from '@/modules/users/queries';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly queryBus: QueryBus) {
    super();
  }

  serializeUser(user: IUserResponse, done: (err: Error | null, id?: string) => void) {
    done(null, user.id);
  }

  async deserializeUser(id: string, done: (err: Error | null, user?: IUserResponse) => void) {
    try {
      const user = await this.queryBus.execute(new FindUserById(id));
      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  }
}
