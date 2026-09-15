import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venture } from '../../entities';
import { FindVentureById } from '../../queries';
import { DeleteVenture } from '../impl';

@CommandHandler(DeleteVenture)
export class DeleteVentureHandler implements ICommandHandler<DeleteVenture, void> {
  private readonly logger = new Logger(DeleteVentureHandler.name);

  constructor(
    @InjectRepository(Venture)
    private readonly repository: Repository<Venture>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteVenture): Promise<void> {
    try {
      await this.queryBus.execute(new FindVentureById(command.id));

      await this.repository.softDelete(command.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Delete venture failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Suppression de l'initiative impossible");
    }
  }
}
