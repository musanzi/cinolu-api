import { Command } from '@nestjs/cqrs';
import { Activity } from '../../entities';

export class ToggleActivityPublication extends Command<Activity> {
  constructor(public readonly id: string) {
    super();
  }
}
