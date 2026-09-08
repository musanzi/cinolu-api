import { Command } from '@nestjs/cqrs';
import { UpdateCategoryDto } from '../../dto';
import { Category } from '../../entities';

export class UpdateCategory extends Command<Category> {
  constructor(
    public readonly id: string,
    public readonly updateCategoryDto: UpdateCategoryDto
  ) {
    super();
  }
}
