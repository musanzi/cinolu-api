import { BadRequestException, ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from '../../entities';
import { ParticipationStatus } from '../../interfaces';
import { FindOwnedParticipationById, FindParticipationById } from '../../queries';
import { UpdateParticipation } from '../impl';

@CommandHandler(UpdateParticipation)
export class UpdateParticipationHandler implements ICommandHandler<UpdateParticipation, Participation> {
  private readonly logger = new Logger(UpdateParticipationHandler.name);

  constructor(
    @InjectRepository(Participation)
    private readonly repository: Repository<Participation>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateParticipation): Promise<Participation> {
    try {
      const participation = await this.queryBus.execute<FindOwnedParticipationById, Participation>(
        new FindOwnedParticipationById(command.id, command.participantId)
      );

      if (participation.status !== ParticipationStatus.PENDING) {
        throw new ForbiddenException('Une participation déjà examinée ne peut plus être modifiée');
      }

      const result = await this.repository.update(
        { id: participation.id, status: ParticipationStatus.PENDING },
        { data: command.dto.data }
      );

      if (!result.affected) {
        throw new ForbiddenException('Une participation déjà examinée ne peut plus être modifiée');
      }

      return await this.queryBus.execute<FindParticipationById, Participation>(new FindParticipationById(command.id));
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      this.logger.error(
        `Update participation failed id="${command.id}" participantId="${command.participantId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Modification de la participation impossible');
    }
  }
}
