import { Command } from '@nestjs/cqrs';
import { Activity } from '../../entities';

export class UploadActivityCover extends Command<Activity> {
  constructor(
    public readonly activityId: string,
    public readonly file: Express.Multer.File
  ) {
    super();
  }
}
