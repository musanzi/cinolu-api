import { Command } from '@nestjs/cqrs';
import { IUserResponse } from '../../interfaces';
import { CreateUserDto } from '../../dto';

export class CreateUser extends Command<IUserResponse> {
  constructor(public readonly createUserDto: CreateUserDto) {
    super();
  }
}
