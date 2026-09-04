import { Command } from '@nestjs/cqrs';
import { UpdateVentureStatusDto } from '../../dto';
import { Venture } from '../../entities';

export class UpdateVentureStatus extends Command<Venture> {
  constructor(
    public readonly id: string,
    public readonly updateVentureStatusDto: UpdateVentureStatusDto
  ) {
    super();
  }
}
