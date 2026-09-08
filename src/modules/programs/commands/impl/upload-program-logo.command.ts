import { Command } from '@nestjs/cqrs';
import { Program } from '../../entities';

export class UploadProgramLogo extends Command<Program> {
  constructor(
    public readonly programId: string,
    public readonly file: Express.Multer.File
  ) {
    super();
  }
}
