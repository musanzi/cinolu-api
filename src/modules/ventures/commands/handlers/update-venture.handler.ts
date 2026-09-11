import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venture } from '../../entities';
import { FindOwnedVentureById, FindVentureById } from '../../queries';
import { UpdateVenture } from '../impl';

@CommandHandler(UpdateVenture)
export class UpdateVentureHandler implements ICommandHandler<UpdateVenture, Venture> {
  private readonly logger = new Logger(UpdateVentureHandler.name);

  constructor(
    @InjectRepository(Venture)
    private readonly repository: Repository<Venture>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateVenture): Promise<Venture> {
    const current = await this.queryBus.execute(new FindOwnedVentureById(command.id, command.ownerId));
    const dto = command.dto;

    try {
      await this.repository.save({
        ...current,
        ...dto,
        sectors: dto?.sectorIds?.map((id) => ({ id }))
      });

      return await this.queryBus.execute(new FindVentureById(command.id));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;

      this.logger.error(
        `Update venture failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Modification de l'initiative impossible");
    }
  }
}
