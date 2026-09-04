import { Query } from '@nestjs/cqrs';
import { Activity } from '../../../entities';

export class FindRecentActivities extends Query<Activity[]> {}
