import { Command } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';

export class DeleteReview extends Command<void> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly id: string
  ) {
    super();
  }
}
