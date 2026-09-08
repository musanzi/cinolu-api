import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../entities';
import { FindRecentActivities } from '../impl';

@QueryHandler(FindRecentActivities)
export class FindRecentActivitiesHandler implements IQueryHandler<FindRecentActivities, Activity[]> {
  private readonly logger = new Logger(FindRecentActivitiesHandler.name);

  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>
  ) {}

  async execute(): Promise<Activity[]> {
    try {
      return await this.repository
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.mentors', 'mentor')
        .leftJoinAndSelect('activity.types', 'type')
        .leftJoinAndSelect('activity.categories', 'category')
        .where('activity.isPublished = true')
        .andWhere('activity.startDate <= :now AND activity.endDate >= :now', { now: new Date() })
        .orderBy('activity.startDate', 'DESC')
        .take(5)
        .getMany();
    } catch (error) {
      this.logger.error(`Find recent activities failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException('Activités récentes introuvables');
    }
  }
}
