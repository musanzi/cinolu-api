import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venture } from '../../entities';
import { DeleteVenture } from '../impl';

@CommandHandler(DeleteVenture)
export class DeleteVentureHandler implements ICommandHandler<DeleteVenture, void> {
  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  async execute(command: DeleteVenture): Promise<void> {
    const venture = await this.repository.findOne({ where: { id: command.id }, relations: { owner: true } });

    if (!venture) throw new NotFoundException('Initiative introuvable');
    if (venture.owner.id !== command.ownerId)
      throw new ForbiddenException('Vous ne pouvez supprimer que vos initiatives');

    await this.repository.softDelete(command.id);
  }
}
