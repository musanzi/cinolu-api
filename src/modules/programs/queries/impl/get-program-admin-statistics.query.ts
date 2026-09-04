import { Query } from '@nestjs/cqrs';
import { IProgramAdminStatistics } from '../../interfaces';

export class GetProgramAdminStatistics extends Query<IProgramAdminStatistics> {}
