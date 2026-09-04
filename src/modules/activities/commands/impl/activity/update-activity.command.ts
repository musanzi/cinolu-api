import { Command } from '@nestjs/cqrs';
import { IUserResponse } from '@/modules/users/interfaces';
import { UpdateActivityDto } from '../../../dto';
import { Activity } from '../../../entities/activity.entity';

export class UpdateActivity extends Command<Activity> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly id: string,
    public readonly updateActivityDto: UpdateActivityDto
  ) {
    super();
  }
}
