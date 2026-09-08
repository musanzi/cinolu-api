import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { FindCategoryById } from '../impl';

@QueryHandler(FindCategoryById)
export class FindCategoryByIdHandler implements IQueryHandler<FindCategoryById, Category> {
  private readonly logger = new Logger(FindCategoryByIdHandler.name);

  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>
  ) {}

  async execute(query: FindCategoryById): Promise<Category> {
    try {
      return await this.repository.findOneByOrFail({ id: query.id });
    } catch (error) {
      this.logger.error(
        `Find category by id failed id="${query.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Catégorie introuvable');
    }
  }
}
