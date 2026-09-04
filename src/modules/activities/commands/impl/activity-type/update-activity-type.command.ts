import { Command } from '@nestjs/cqrs';
import { UpdateActivityTypeDto } from '../../../dto';
import { ActivityType } from '../../../entities';

export class UpdateActivityType extends Command<ActivityType> {
  constructor(
    public readonly id: string,
    public readonly updateActivityTypeDto: UpdateActivityTypeDto
  ) {
    super();
  }
}
