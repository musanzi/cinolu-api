import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { FindCategoryById } from '../../queries';
import { UpdateCategory } from '../impl';

@CommandHandler(UpdateCategory)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategory, Category> {
  private readonly logger = new Logger(UpdateCategoryHandler.name);

  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateCategory): Promise<Category> {
    try {
      const category = await this.queryBus.execute(new FindCategoryById(command.id));

      return await this.repository.save({
        ...category,
        ...command.updateCategoryDto
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Update category failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Modification de la catégorie impossible');
    }
  }
}
