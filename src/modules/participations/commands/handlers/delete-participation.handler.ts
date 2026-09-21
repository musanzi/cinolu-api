import { BadRequestException, ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from '../../entities';
import { ParticipationStatus } from '../../interfaces';
import { FindParticipationById } from '../../queries';
import { DeleteParticipation } from '../impl';

@CommandHandler(DeleteParticipation)
export class DeleteParticipationHandler implements ICommandHandler<DeleteParticipation, void> {
  private readonly logger = new Logger(DeleteParticipationHandler.name);

  constructor(
    @InjectRepository(Participation)
    private readonly repository: Repository<Participation>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteParticipation): Promise<void> {
    try {
      const participation = await this.queryBus.execute(new FindParticipationById(command.id));

      if (!command.isStaff) {
        if (participation.participant.id !== command.userId) {
          throw new ForbiddenException('Vous ne pouvez pas supprimer la participation de quelqu’un d’autre');
        }

        if (participation.status !== ParticipationStatus.PENDING) {
          throw new ForbiddenException('Une participation déjà examinée ne peut plus être retirée');
        }
      }

      await this.repository.softDelete(command.id);
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Delete participation failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Suppression de la participation impossible');
    }
  }
}
