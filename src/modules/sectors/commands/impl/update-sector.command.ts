import { Command } from '@nestjs/cqrs';
import { UpdateSectorDto } from '../../dto';
import { Sector } from '../../entities';

export class UpdateSector extends Command<Sector> {
  constructor(
    public readonly id: string,
    public readonly updateSectorDto: UpdateSectorDto
  ) {
    super();
  }
}
