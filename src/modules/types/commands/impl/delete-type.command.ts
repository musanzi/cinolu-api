import { Command } from '@nestjs/cqrs';

export class DeleteType extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
