import { Command } from '@nestjs/cqrs';
import { IUserResponse } from '../../interfaces';

export class UploadUserAvatar extends Command<IUserResponse> {
  constructor(
    public readonly userId: string,
    public readonly file: Express.Multer.File
  ) {
    super();
  }
}
