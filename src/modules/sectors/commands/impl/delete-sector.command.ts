import { Command } from '@nestjs/cqrs';

export class DeleteSector extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
