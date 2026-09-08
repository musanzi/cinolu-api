import { Command } from '@nestjs/cqrs';
import { CreateCategoryDto } from '../../dto';
import { Category } from '../../entities';

export class CreateCategory extends Command<Category> {
  constructor(public readonly createCategoryDto: CreateCategoryDto) {
    super();
  }
}
