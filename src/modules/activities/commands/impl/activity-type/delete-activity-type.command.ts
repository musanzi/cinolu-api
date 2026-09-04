import { Command } from '@nestjs/cqrs';

export class DeleteActivityType extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
