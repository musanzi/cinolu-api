import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cohort } from '../../entities';
import { FindCohorts } from '../impl';

@QueryHandler(FindCohorts)
export class FindCohortsHandler implements IQueryHandler<FindCohorts, [Cohort[], number]> {
  private readonly logger = new Logger(FindCohortsHandler.name);

  constructor(
    @InjectRepository(Cohort)
    private readonly repository: Repository<Cohort>
  ) {}

  async execute(query: FindCohorts): Promise<[Cohort[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository
        .createQueryBuilder('cohort')
        .leftJoinAndSelect('cohort.program', 'program')
        .orderBy('cohort.createdAt', 'DESC');

      if (query.params.programId) builder.andWhere('program.id = :programId', { programId: query.params.programId });

      return await builder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Find cohorts failed params="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Cohortes introuvables');
    }
  }
}
