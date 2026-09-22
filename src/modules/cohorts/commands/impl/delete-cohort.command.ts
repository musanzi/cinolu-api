import { Command } from '@nestjs/cqrs';

export class DeleteCohort extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
