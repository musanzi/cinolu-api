import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentureCategory } from '../../../entities';
import { DeleteVentureCategory } from '../../impl';

@CommandHandler(DeleteVentureCategory)
export class DeleteVentureCategoryHandler implements ICommandHandler<DeleteVentureCategory, void> {
  constructor(
    @InjectRepository(VentureCategory)
    private readonly repository: Repository<VentureCategory>
  ) {}

  async execute(command: DeleteVentureCategory): Promise<void> {
    const result = await this.repository.softDelete(command.id);

    if (!result.affected) throw new NotFoundException("Catégorie d'initiative introuvable");
  }
}
