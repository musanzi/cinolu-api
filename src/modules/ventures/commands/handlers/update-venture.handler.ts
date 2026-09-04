import { BadRequestException, ConflictException, ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Venture } from '../../entities';
import { getVentureFields } from '../../helpers';
import { VentureStatus } from '../../interfaces';
import { UpdateVenture } from '../impl';

@CommandHandler(UpdateVenture)
export class UpdateVentureHandler implements ICommandHandler<UpdateVenture, Venture> {
  private readonly logger = new Logger(UpdateVentureHandler.name);

  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  async execute(command: UpdateVenture): Promise<Venture> {
    const { ownerId, id, updateVentureDto } = command;
    const venture = await this.repository.findOne({ where: { id }, relations: { owner: true } });

    if (!venture) throw new NotFoundException('Initiative introuvable');
    if (venture.owner.id !== ownerId) throw new ForbiddenException('Vous ne pouvez modifier que vos initiatives');

    try {
      return await this.repository.save(
        this.repository.merge(venture, getVentureFields(updateVentureDto), { status: VentureStatus.DRAFT })
      );
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      ) {
        throw new ConflictException('Une initiative avec ce nom existe déjà');
      }

      this.logger.error(`Update venture failed id="${id}": ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException("Modification de l'initiative impossible");
    }
  }
}
