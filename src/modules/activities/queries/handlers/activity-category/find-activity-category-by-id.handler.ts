import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityCategory } from '../../../entities';
import { FindActivityCategoryById } from '../../impl';

@QueryHandler(FindActivityCategoryById)
export class FindActivityCategoryByIdHandler implements IQueryHandler<FindActivityCategoryById, ActivityCategory> {
  constructor(
    @InjectRepository(ActivityCategory)
    private readonly repository: Repository<ActivityCategory>
  ) {}

  async execute(query: FindActivityCategoryById): Promise<ActivityCategory> {
    const category = await this.repository.findOneBy({ id: query.id });

    if (!category) throw new NotFoundException("Catégorie d'activité introuvable");

    return category;
  }
}
