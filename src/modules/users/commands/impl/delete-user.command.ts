import { Command } from '@nestjs/cqrs';

export class DeleteUser extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
