import { Command } from '@nestjs/cqrs';
import { CreateActivityDto } from '../../dto';
import { Activity } from '../../entities';

export class CreateActivity extends Command<Activity> {
  constructor(public readonly createActivityDto: CreateActivityDto) {
    super();
  }
}
