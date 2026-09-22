import { FindProgramById } from '@/modules/programs/queries';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cohort } from '../../entities';
import { FindCohortById } from '../../queries';
import { CreateCohort } from '../impl';

@CommandHandler(CreateCohort)
export class CreateCohortHandler implements ICommandHandler<CreateCohort, Cohort> {
  private readonly logger = new Logger(CreateCohortHandler.name);

  constructor(
    @InjectRepository(Cohort)
    private readonly repository: Repository<Cohort>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: CreateCohort): Promise<Cohort> {
    try {
      const { programId, ...fields } = command.createCohortDto;
      await this.queryBus.execute(new FindProgramById(programId));

      const created = await this.repository.save(
        this.repository.create({
          ...fields,
          program: { id: programId }
        })
      );
      return await this.queryBus.execute(new FindCohortById(created.id));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Create cohort failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException('Création de la cohorte impossible');
    }
  }
}
