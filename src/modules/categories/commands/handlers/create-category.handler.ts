import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { CreateCategory } from '../impl';

@CommandHandler(CreateCategory)
export class CreateCategoryHandler implements ICommandHandler<CreateCategory, Category> {
  private readonly logger = new Logger(CreateCategoryHandler.name);

  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>
  ) {}

  async execute(command: CreateCategory): Promise<Category> {
    try {
      return await this.repository.save(command.createCategoryDto);
    } catch (error) {
      this.logger.error(`Create category failed: ${error instanceof Error ? error.message : String(error)}`);

      throw new BadRequestException('Création de la catégorie impossible');
    }
  }
}
