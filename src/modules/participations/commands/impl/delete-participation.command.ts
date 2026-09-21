import { Command } from '@nestjs/cqrs';

export class DeleteParticipation extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly isStaff: boolean,
    public readonly id: string
  ) {
    super();
  }
}
