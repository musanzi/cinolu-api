import { Command } from '@nestjs/cqrs';
import { UpdateActivityCategoryDto } from '../../../dto';
import { ActivityCategory } from '../../../entities';

export class UpdateActivityCategory extends Command<ActivityCategory> {
  constructor(
    public readonly id: string,
    public readonly updateActivityCategoryDto: UpdateActivityCategoryDto
  ) {
    super();
  }
}
