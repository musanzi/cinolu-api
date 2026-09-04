import { Command } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { CreateActivityDto } from '../../../dto';
import { Activity } from '../../../entities/activity.entity';

export class CreateActivity extends Command<Activity> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly createActivityDto: CreateActivityDto
  ) {
    super();
  }
}
