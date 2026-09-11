import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venture } from '../../entities';
import { VentureStatusChangedEvent } from '../../events';
import { VentureStatus } from '../../interfaces';
import { FindVentureById } from '../../queries';
import { UpdateVentureStatus } from '../impl';

@CommandHandler(UpdateVentureStatus)
export class UpdateVentureStatusHandler implements ICommandHandler<UpdateVentureStatus, Venture> {
  private readonly logger = new Logger(UpdateVentureStatusHandler.name);

  constructor(
    @InjectRepository(Venture)
    private readonly repository: Repository<Venture>,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: UpdateVentureStatus): Promise<Venture> {
    try {
      const current = await this.queryBus.execute<FindVentureById, Venture>(new FindVentureById(command.id));
      const statusChanged = current.status !== command.dto.status;

      if (statusChanged) {
        await this.repository.update(command.id, { status: command.dto.status });
      }

      const venture = statusChanged
        ? await this.queryBus.execute<FindVentureById, Venture>(new FindVentureById(command.id))
        : current;

      if (statusChanged && venture.status !== VentureStatus.PENDING) {
        this.eventBus.publish(new VentureStatusChangedEvent(venture));
      }

      return venture;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      this.logger.error(
        `Update venture status failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Modification du statut de l'initiative impossible");
    }
  }
}
