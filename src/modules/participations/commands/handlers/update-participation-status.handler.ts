import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from '../../entities';
import { ParticipationStatusChangedEvent } from '../../events';
import { ParticipationStatus } from '../../interfaces';
import { FindParticipationById } from '../../queries';
import { UpdateParticipationStatus } from '../impl';

@CommandHandler(UpdateParticipationStatus)
export class UpdateParticipationStatusHandler implements ICommandHandler<UpdateParticipationStatus, Participation> {
  private readonly logger = new Logger(UpdateParticipationStatusHandler.name);

  constructor(
    @InjectRepository(Participation)
    private readonly repository: Repository<Participation>,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: UpdateParticipationStatus): Promise<Participation> {
    try {
      const current = await this.queryBus.execute<FindParticipationById, Participation>(
        new FindParticipationById(command.id)
      );
      const statusChanged = current.status !== command.dto.status;

      if (statusChanged) {
        await this.repository.update(command.id, { status: command.dto.status });
      }

      const participation = statusChanged
        ? await this.queryBus.execute<FindParticipationById, Participation>(new FindParticipationById(command.id))
        : current;

      if (statusChanged && participation.status !== ParticipationStatus.PENDING) {
        this.eventBus.publish(new ParticipationStatusChangedEvent(participation));
      }

      return participation;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      this.logger.error(
        `Update participation status failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Modification du statut de la participation impossible');
    }
  }
}
