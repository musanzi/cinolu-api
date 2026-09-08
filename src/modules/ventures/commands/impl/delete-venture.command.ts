import { Command } from '@nestjs/cqrs';

export class DeleteVenture extends Command<void> {
  constructor(
    public readonly ownerId: string,
    public readonly id: string
  ) {
    super();
  }
}
