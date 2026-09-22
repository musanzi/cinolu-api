import { Provider } from '@nestjs/common';
import { CreateCohortHandler } from './create-cohort.handler';
import { DeleteCohortHandler } from './delete-cohort.handler';
import { UpdateCohortHandler } from './update-cohort.handler';

export const CommandHandlers: Provider[] = [CreateCohortHandler, UpdateCohortHandler, DeleteCohortHandler];
