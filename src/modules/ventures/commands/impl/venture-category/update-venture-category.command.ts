import { Command } from '@nestjs/cqrs';
import { UpdateVentureCategoryDto } from '../../../dto';
import { VentureCategory } from '../../../entities';

export class UpdateVentureCategory extends Command<VentureCategory> {
  constructor(
    public readonly id: string,
    public readonly updateVentureCategoryDto: UpdateVentureCategoryDto
  ) {
    super();
  }
}
