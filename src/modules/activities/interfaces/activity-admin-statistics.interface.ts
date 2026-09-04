import { INamedCount } from '@/shared/interfaces';

export interface IActivityLifecycleStatistics {
  upcoming: number;
  ongoing: number;
  completed: number;
}

export interface IActivityAdminStatistics {
  total: number;
  lifecycle: IActivityLifecycleStatistics;
  byType: INamedCount[];
}
