import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cohort } from '../../entities';
import { FindCohortById } from '../../queries';
import { DeleteCohort } from '../impl';

@CommandHandler(DeleteCohort)
export class DeleteCohortHandler implements ICommandHandler<DeleteCohort, void> {
  private readonly logger = new Logger(DeleteCohortHandler.name);

  constructor(
    @InjectRepository(Cohort)
    private readonly repository: Repository<Cohort>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteCohort): Promise<void> {
    try {
      const cohort = await this.queryBus.execute(new FindCohortById(command.id));

      await this.repository.softDelete(cohort.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Delete cohort failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Suppression de la cohorte impossible');
    }
  }
}
