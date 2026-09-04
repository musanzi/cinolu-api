import { Command } from '@nestjs/cqrs';
import { CreateUserDto } from '../../dto';
import { IUserResponse } from '../../interfaces';

export class FindOrCreateUser extends Command<IUserResponse> {
  constructor(public readonly createUserDto: CreateUserDto) {
    super();
  }
}
