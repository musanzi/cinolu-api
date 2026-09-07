import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentureCategory } from '../../../entities';
import { FindVentureCategoryById } from '../../impl';

@QueryHandler(FindVentureCategoryById)
export class FindVentureCategoryByIdHandler implements IQueryHandler<FindVentureCategoryById, VentureCategory> {
  constructor(
    @InjectRepository(VentureCategory)
    private readonly repository: Repository<VentureCategory>
  ) {}

  async execute(query: FindVentureCategoryById): Promise<VentureCategory> {
    const category = await this.repository.findOneBy({ id: query.id });

    if (!category) throw new NotFoundException("Catégorie d'initiative introuvable");

    return category;
  }
}
