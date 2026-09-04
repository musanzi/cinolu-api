import { Command } from '@nestjs/cqrs';
import { UpdateVentureDto } from '../../dto';
import { Venture } from '../../entities';

export class UpdateVenture extends Command<Venture> {
  constructor(
    public readonly ownerId: string,
    public readonly id: string,
    public readonly updateVentureDto: UpdateVentureDto
  ) {
    super();
  }
}
