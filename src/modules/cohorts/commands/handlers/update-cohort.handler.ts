import { FindProgramById } from '@/modules/programs/queries';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cohort } from '../../entities';
import { FindCohortById } from '../../queries';
import { UpdateCohort } from '../impl';

@CommandHandler(UpdateCohort)
export class UpdateCohortHandler implements ICommandHandler<UpdateCohort, Cohort> {
  private readonly logger = new Logger(UpdateCohortHandler.name);

  constructor(
    @InjectRepository(Cohort)
    private readonly repository: Repository<Cohort>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateCohort): Promise<Cohort> {
    try {
      const cohort = await this.queryBus.execute(new FindCohortById(command.id));
      const { programId, ...fields } = command.updateCohortDto;

      if (programId) await this.queryBus.execute(new FindProgramById(programId));

      await this.repository.save({
        ...cohort,
        ...fields,
        program: programId ? { id: programId } : cohort.program
      });

      return await this.queryBus.execute(new FindCohortById(cohort.id));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;

      this.logger.error(
        `Update cohort failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Mise à jour de la cohorte impossible');
    }
  }
}
