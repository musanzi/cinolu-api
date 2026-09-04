import { Command } from '@nestjs/cqrs';

export class ImportUsersCsv extends Command<void> {
  constructor(public readonly file: Express.Multer.File) {
    super();
  }
}
