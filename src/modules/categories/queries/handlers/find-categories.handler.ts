import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { FindCategories } from '../impl';

@QueryHandler(FindCategories)
export class FindCategoriesHandler implements IQueryHandler<FindCategories, [Category[], number]> {
  private readonly logger = new Logger(FindCategoriesHandler.name);

  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>
  ) {}

  async execute(query: FindCategories): Promise<[Category[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository.createQueryBuilder('category').orderBy('category.name', 'ASC');

      if (query.params.q) builder.where('category.name ILIKE :q', { q: `%${query.params.q}%` });

      return await builder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Find categories failed params="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Catégories introuvables');
    }
  }
}
