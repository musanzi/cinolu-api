import { Command } from '@nestjs/cqrs';
import { CreateActivityTypeDto } from '../../../dto';
import { ActivityType } from '../../../entities';

export class CreateActivityType extends Command<ActivityType> {
  constructor(public readonly createActivityTypeDto: CreateActivityTypeDto) {
    super();
  }
}
