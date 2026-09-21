import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from '../../entities';
import { DeleteParticipation } from '../impl';

@CommandHandler(DeleteParticipation)
export class DeleteParticipationHandler implements ICommandHandler<DeleteParticipation, void> {
  private readonly logger = new Logger(DeleteParticipationHandler.name);

  constructor(
    @InjectRepository(Participation)
    private readonly repository: Repository<Participation>
  ) {}

  async execute(command: DeleteParticipation): Promise<void> {
    try {
      await this.repository.delete(command.id);
    } catch (error) {
      this.logger.error(
        `Delete participation failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Suppression de la participation impossible');
    }
  }
}
