import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../../entities/activity.entity';
import { FindActivitiesByProgramSlug } from '../../impl';

@QueryHandler(FindActivitiesByProgramSlug)
export class FindActivitiesByProgramSlugHandler implements IQueryHandler<FindActivitiesByProgramSlug, Activity[]> {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>
  ) {}

  execute(query: FindActivitiesByProgramSlug): Promise<Activity[]> {
    return this.repository
      .createQueryBuilder('activity')
      .innerJoinAndSelect('activity.program', 'program', 'program.slug = :programSlug', {
        programSlug: query.programSlug
      })
      .leftJoinAndSelect('activity.type', 'type')
      .leftJoinAndSelect('activity.categories', 'category')
      .orderBy('activity.updatedAt', 'DESC')
      .getMany();
  }
}
