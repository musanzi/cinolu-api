import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentureCategory } from '../../../entities';
import { CreateVentureCategory } from '../../impl';

@CommandHandler(CreateVentureCategory)
export class CreateVentureCategoryHandler implements ICommandHandler<CreateVentureCategory, VentureCategory> {
  constructor(
    @InjectRepository(VentureCategory)
    private readonly repository: Repository<VentureCategory>
  ) {}

  async execute(command: CreateVentureCategory): Promise<VentureCategory> {
    try {
      return await this.repository.save(this.repository.create(command.createVentureCategoryDto));
    } catch {
      throw new BadRequestException("Création de la catégorie d'initiative impossible");
    }
  }
}
