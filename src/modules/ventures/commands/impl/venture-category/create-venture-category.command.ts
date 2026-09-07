import { Command } from '@nestjs/cqrs';
import { CreateVentureCategoryDto } from '../../../dto';
import { VentureCategory } from '../../../entities';

export class CreateVentureCategory extends Command<VentureCategory> {
  constructor(public readonly createVentureCategoryDto: CreateVentureCategoryDto) {
    super();
  }
}
