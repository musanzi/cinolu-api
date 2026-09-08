import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../entities';
import { FindActivities } from '../impl';

@QueryHandler(FindActivities)
export class FindActivitiesHandler implements IQueryHandler<FindActivities, [Activity[], number]> {
  private readonly logger = new Logger(FindActivitiesHandler.name);

  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>
  ) {}

  async execute(query: FindActivities): Promise<[Activity[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.program', 'program')
        .leftJoinAndSelect('activity.mentors', 'mentor')
        .leftJoinAndSelect('activity.types', 'type')
        .leftJoinAndSelect('activity.categories', 'category')
        .orderBy('activity.startDate', 'DESC')
        .distinct(true);

      if (query.publishedOnly) builder.andWhere('activity.isPublished = true');
      if (query.params.q) builder.andWhere('activity.name ILIKE :q', { q: `%${query.params.q}%` });
      if (query.params.startDate)
        builder.andWhere('activity.startDate >= :startDate', { startDate: query.params.startDate });
      if (query.params.endDate) builder.andWhere('activity.endDate <= :endDate', { endDate: query.params.endDate });

      return await builder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Find activities failed params="${JSON.stringify(query.params)}" publishedOnly="${query.publishedOnly}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Activités introuvables');
    }
  }
}
