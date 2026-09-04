import { Command } from '@nestjs/cqrs';

export class DeleteProgram extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
