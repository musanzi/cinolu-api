import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityType } from '../../../entities';
import { DeleteActivityType } from '../../impl';

@CommandHandler(DeleteActivityType)
export class DeleteActivityTypeHandler implements ICommandHandler<DeleteActivityType, void> {
  constructor(
    @InjectRepository(ActivityType)
    private readonly repository: Repository<ActivityType>
  ) {}

  async execute(command: DeleteActivityType): Promise<void> {
    const result = await this.repository.softDelete(command.id);

    if (!result.affected) throw new NotFoundException("Type d'activité introuvable");
  }
}
