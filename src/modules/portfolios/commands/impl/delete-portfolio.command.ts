import { Command } from '@nestjs/cqrs';

export class DeletePortfolio extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
