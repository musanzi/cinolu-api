import { Command } from '@nestjs/cqrs';
import { CreateCohortDto } from '../../dto';
import { Cohort } from '../../entities';

export class CreateCohort extends Command<Cohort> {
  constructor(public readonly createCohortDto: CreateCohortDto) {
    super();
  }
}
