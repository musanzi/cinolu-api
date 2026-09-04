import { IMonthlyCount, INamedCount } from '@/shared/interfaces';
import { ParticipationStatus } from './participation.interface';

export interface IParticipationMonthlyStatusCount extends IMonthlyCount {
  status: ParticipationStatus;
}

export interface IParticipationAdminStatistics {
  total: number;
  byStatus: INamedCount[];
  trend: IParticipationMonthlyStatusCount[];
}
