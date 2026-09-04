import { IUserResponse } from '@/modules/users/interfaces';
import { Roles } from '@/modules/auth/enums';
import { ActivityCategory } from '../entities/activity-category.entity';
import { Activity } from '../entities/activity.entity';

export function mapActivityCategories(ids?: string[]): Pick<ActivityCategory, 'id'>[] | undefined {
  return ids?.map((id) => ({ id }));
}

export function isAdmin(actor: IUserResponse): boolean {
  return actor.roles?.includes(Roles.STAFF);
}

export function isActivityOngoing(activity: Pick<Activity, 'startDate' | 'endDate'>, date: Date = new Date()): boolean {
  return activity.startDate <= date && activity.endDate >= date;
}
