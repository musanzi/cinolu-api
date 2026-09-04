import { Command } from '@nestjs/cqrs';
import { UpdateUserDto } from '@/modules/users/dto';
import { User } from '@/modules/users/entities/user.entity';
import { IUserResponse } from '@/modules/users/interfaces';

export class UpdateProfile extends Command<IUserResponse> {
  constructor(
    public readonly currentUser: User,
    public readonly updateUserDto: UpdateUserDto
  ) {
    super();
  }
}
