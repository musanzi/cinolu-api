import { Command } from '@nestjs/cqrs';

export class DeleteCategory extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
