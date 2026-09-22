import { PartialType } from '@nestjs/mapped-types';
import { CreateCohortDto } from './create-cohort.dto';

export class UpdateCohortDto extends PartialType(CreateCohortDto) {}
