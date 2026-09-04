import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../../entities/activity.entity';
import { FindRecentActivities } from '../../impl';

@QueryHandler(FindRecentActivities)
export class FindRecentActivitiesHandler implements IQueryHandler<FindRecentActivities, Activity[]> {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>
  ) {}

  execute(): Promise<Activity[]> {
    return this.repository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.program', 'program')
      .leftJoinAndSelect('activity.type', 'type')
      .leftJoinAndSelect('activity.categories', 'category')
      .orderBy('activity.startDate', 'DESC')
      .take(10)
      .getMany();
  }
}
