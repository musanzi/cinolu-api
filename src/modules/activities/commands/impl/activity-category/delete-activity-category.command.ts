import { Command } from '@nestjs/cqrs';

export class DeleteActivityCategory extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
