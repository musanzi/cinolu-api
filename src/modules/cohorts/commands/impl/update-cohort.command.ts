import { Command } from '@nestjs/cqrs';
import { UpdateCohortDto } from '../../dto';
import { Cohort } from '../../entities';

export class UpdateCohort extends Command<Cohort> {
  constructor(
    public readonly id: string,
    public readonly updateCohortDto: UpdateCohortDto
  ) {
    super();
  }
}
