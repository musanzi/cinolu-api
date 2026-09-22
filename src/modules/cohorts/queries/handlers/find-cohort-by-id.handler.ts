import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cohort } from '../../entities';
import { FindCohortById } from '../impl';

@QueryHandler(FindCohortById)
export class FindCohortByIdHandler implements IQueryHandler<FindCohortById, Cohort> {
  private readonly logger = new Logger(FindCohortByIdHandler.name);

  constructor(
    @InjectRepository(Cohort)
    private readonly repository: Repository<Cohort>
  ) {}

  async execute(query: FindCohortById): Promise<Cohort> {
    try {
      return await this.repository.findOneOrFail({
        where: { id: query.id },
        relations: ['program']
      });
    } catch (error) {
      this.logger.error(
        `Find cohort by id failed id="${query.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Cohorte introuvable');
    }
  }
}
