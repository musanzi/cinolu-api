import { Command } from '@nestjs/cqrs';
import { CreateActivityCategoryDto } from '../../../dto';
import { ActivityCategory } from '../../../entities';

export class CreateActivityCategory extends Command<ActivityCategory> {
  constructor(public readonly createActivityCategoryDto: CreateActivityCategoryDto) {
    super();
  }
}
