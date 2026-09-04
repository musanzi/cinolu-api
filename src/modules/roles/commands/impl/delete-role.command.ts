import { Command } from '@nestjs/cqrs';

export class DeleteRole extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
