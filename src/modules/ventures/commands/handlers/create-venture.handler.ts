import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venture } from '../../entities';
import { VentureStatusChangedEvent } from '../../events';
import { FindVentureById } from '../../queries';
import { CreateVenture } from '../impl';

@CommandHandler(CreateVenture)
export class CreateVentureHandler implements ICommandHandler<CreateVenture, Venture> {
  private readonly logger = new Logger(CreateVentureHandler.name);

  constructor(
    @InjectRepository(Venture)
    private readonly repository: Repository<Venture>,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: CreateVenture): Promise<Venture> {
    const dto = command.dto;

    try {
      const created = await this.repository.save({
        ...dto,
        sectors: dto?.sectorIds.map((id) => ({ id })),
        owner: { id: command.ownerId }
      });

      const venture = await this.queryBus.execute<FindVentureById, Venture>(new FindVentureById(created.id));

      this.eventBus.publish(new VentureStatusChangedEvent(venture));

      return venture;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(`Create venture failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException("Création de l'initiative impossible");
    }
  }
}
