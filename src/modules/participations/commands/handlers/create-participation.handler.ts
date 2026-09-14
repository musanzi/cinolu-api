import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from '../../entities';
import { FindParticipationById } from '../../queries';
import { CreateParticipation } from '../impl';

@CommandHandler(CreateParticipation)
export class CreateParticipationHandler implements ICommandHandler<CreateParticipation, Participation> {
  private readonly logger = new Logger(CreateParticipationHandler.name);

  constructor(
    @InjectRepository(Participation)
    private readonly repository: Repository<Participation>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: CreateParticipation): Promise<Participation> {
    const { participantId, dto } = command;

    try {
      const created = await this.repository.save({
        participant: { id: participantId },
        activity: { id: dto.activityId },
        data: dto.data
      });

      return await this.queryBus.execute<FindParticipationById, Participation>(new FindParticipationById(created.id));
    } catch (error) {
      this.logger.error(
        `Create participation failed participantId="${participantId}" activityId="${dto.activityId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Création de la participation impossible');
    }
  }
}
