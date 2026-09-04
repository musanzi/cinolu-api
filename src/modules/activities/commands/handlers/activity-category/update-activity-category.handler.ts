import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityCategory } from '../../../entities';
import { FindActivityCategoryById } from '../../../queries';
import { UpdateActivityCategory } from '../../impl';

@CommandHandler(UpdateActivityCategory)
export class UpdateActivityCategoryHandler implements ICommandHandler<UpdateActivityCategory, ActivityCategory> {
  constructor(
    @InjectRepository(ActivityCategory)
    private readonly repository: Repository<ActivityCategory>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateActivityCategory): Promise<ActivityCategory> {
    try {
      const category = await this.queryBus.execute<FindActivityCategoryById, ActivityCategory>(
        new FindActivityCategoryById(command.id)
      );

      return await this.repository.save(this.repository.merge(category, command.updateActivityCategoryDto));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new BadRequestException("Modification de la catégorie d'activité impossible");
    }
  }
}
