import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityType } from '../../../entities';
import { FindActivityTypeById } from '../../impl';

@QueryHandler(FindActivityTypeById)
export class FindActivityTypeByIdHandler implements IQueryHandler<FindActivityTypeById, ActivityType> {
  constructor(
    @InjectRepository(ActivityType)
    private readonly repository: Repository<ActivityType>
  ) {}

  async execute(query: FindActivityTypeById): Promise<ActivityType> {
    const activityType = await this.repository.findOneBy({ id: query.id });

    if (!activityType) throw new NotFoundException("Type d'activité introuvable");

    return activityType;
  }
}
