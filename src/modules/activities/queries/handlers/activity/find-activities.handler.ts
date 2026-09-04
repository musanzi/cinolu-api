import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '@/modules/auth/enums';
import { parsePaginationParams } from '@/shared/helpers';
import { Activity } from '../../../entities/activity.entity';
import { FindActivities } from '../../impl';

@QueryHandler(FindActivities)
export class FindActivitiesHandler implements IQueryHandler<FindActivities, [Activity[], number]> {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>
  ) {}

  execute(query: FindActivities): Promise<[Activity[], number]> {
    const { pageNumber, limitNumber } = parsePaginationParams(query.params);
    const builder = this.repository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.program', 'program')
      .leftJoinAndSelect('program.programManagers', 'manager')
      .leftJoinAndSelect('activity.type', 'type')
      .leftJoinAndSelect('activity.categories', 'category')
      .orderBy('activity.updatedAt', 'DESC')
      .distinct(true);

    if (!query.actor.roles?.includes(Roles.STAFF)) {
      builder.andWhere('((activity.startDate <= :now AND activity.endDate >= :now) OR manager.id = :userId)', {
        now: new Date(),
        userId: query.actor.id
      });
    }

    if (query.params.q) builder.andWhere('activity.name ILIKE :q', { q: `%${query.params.q}%` });
    if (query.params.programId)
      builder.andWhere('activity.programId = :programId', { programId: query.params.programId });
    if (query.params.typeId) builder.andWhere('activity.typeId = :typeId', { typeId: query.params.typeId });
    if (query.params.categoryId) builder.andWhere('category.id = :categoryId', { categoryId: query.params.categoryId });
    if (query.params.startDate)
      builder.andWhere('activity.startDate >= :startDate', { startDate: query.params.startDate });
    if (query.params.endDate) builder.andWhere('activity.endDate <= :endDate', { endDate: query.params.endDate });

    return builder
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();
  }
}
