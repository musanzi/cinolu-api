import { Command } from '@nestjs/cqrs';
import { UpdateActivityDto } from '../../dto';
import { Activity } from '../../entities';

export class UpdateActivity extends Command<Activity> {
  constructor(
    public readonly id: string,
    public readonly updateActivityDto: UpdateActivityDto
  ) {
    super();
  }
}
