import { Command } from '@nestjs/cqrs';
import { CreateSectorDto } from '../../dto';
import { Sector } from '../../entities';

export class CreateSector extends Command<Sector> {
  constructor(public readonly createSectorDto: CreateSectorDto) {
    super();
  }
}
