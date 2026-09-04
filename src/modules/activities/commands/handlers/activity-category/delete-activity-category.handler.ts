import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityCategory } from '../../../entities';
import { DeleteActivityCategory } from '../../impl';

@CommandHandler(DeleteActivityCategory)
export class DeleteActivityCategoryHandler implements ICommandHandler<DeleteActivityCategory, void> {
  constructor(
    @InjectRepository(ActivityCategory)
    private readonly repository: Repository<ActivityCategory>
  ) {}

  async execute(command: DeleteActivityCategory): Promise<void> {
    const result = await this.repository.softDelete(command.id);

    if (!result.affected) throw new NotFoundException("Catégorie d'activité introuvable");
  }
}
