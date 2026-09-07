import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentureCategory } from '../../../entities';
import { FindVentureCategoryById } from '../../../queries';
import { UpdateVentureCategory } from '../../impl';

@CommandHandler(UpdateVentureCategory)
export class UpdateVentureCategoryHandler implements ICommandHandler<UpdateVentureCategory, VentureCategory> {
  constructor(
    @InjectRepository(VentureCategory)
    private readonly repository: Repository<VentureCategory>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateVentureCategory): Promise<VentureCategory> {
    try {
      const category = await this.queryBus.execute<FindVentureCategoryById, VentureCategory>(
        new FindVentureCategoryById(command.id)
      );

      return await this.repository.save(this.repository.merge(category, command.updateVentureCategoryDto));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new BadRequestException("Modification de la catégorie d'initiative impossible");
    }
  }
}
