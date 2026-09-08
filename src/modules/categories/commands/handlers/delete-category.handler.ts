import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { FindCategoryById } from '../../queries';
import { DeleteCategory } from '../impl';

@CommandHandler(DeleteCategory)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategory, void> {
  private readonly logger = new Logger(DeleteCategoryHandler.name);

  constructor(
    @InjectRepository(Category) private readonly repository: Repository<Category>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteCategory): Promise<void> {
    try {
      await this.queryBus.execute(new FindCategoryById(command.id));
      await this.repository.softDelete(command.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Delete category failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Suppression de la catégorie impossible');
    }
  }
}
