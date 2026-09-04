import { Query } from '@nestjs/cqrs';
import { IActivityAdminStatistics } from '../../../interfaces';

export class GetActivityAdminStatistics extends Query<IActivityAdminStatistics> {
  constructor(public readonly asOf: Date) {
    super();
  }
}
