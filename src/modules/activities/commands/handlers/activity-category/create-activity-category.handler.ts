import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityCategory } from '../../../entities';
import { CreateActivityCategory } from '../../impl';

@CommandHandler(CreateActivityCategory)
export class CreateActivityCategoryHandler implements ICommandHandler<CreateActivityCategory, ActivityCategory> {
  constructor(
    @InjectRepository(ActivityCategory)
    private readonly repository: Repository<ActivityCategory>
  ) {}

  async execute(command: CreateActivityCategory): Promise<ActivityCategory> {
    try {
      return await this.repository.save(this.repository.create(command.createActivityCategoryDto));
    } catch {
      throw new BadRequestException("Création de la catégorie d'activité impossible");
    }
  }
}
