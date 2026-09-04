import { Command } from '@nestjs/cqrs';
import { CreateVentureDto } from '../../dto';
import { Venture } from '../../entities';

export class CreateVenture extends Command<Venture> {
  constructor(
    public readonly ownerId: string,
    public readonly createVentureDto: CreateVentureDto
  ) {
    super();
  }
}
