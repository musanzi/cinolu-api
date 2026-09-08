import { Command } from '@nestjs/cqrs';
import { Venture } from '../../entities';
import { VentureImageField } from '../../interfaces';

export class UploadVentureImage extends Command<Venture> {
  constructor(
    public readonly ownerId: string,
    public readonly ventureId: string,
    public readonly field: VentureImageField,
    public readonly file: Express.Multer.File
  ) {
    super();
  }
}
