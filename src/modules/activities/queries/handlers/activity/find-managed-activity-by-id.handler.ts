import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '@/modules/auth/enums';
import { Activity } from '../../../entities/activity.entity';
import { FindManagedActivityById } from '../../impl';

@QueryHandler(FindManagedActivityById)
export class FindManagedActivityByIdHandler implements IQueryHandler<FindManagedActivityById, Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>
  ) {}

  async execute(query: FindManagedActivityById): Promise<Activity> {
    const activity = await this.repository.findOne({
      where: { id: query.id },
      relations: { program: { programManagers: true } }
    });

    if (!activity) throw new NotFoundException('Activité introuvable');

    const isAdmin = query.actor.roles?.includes(Roles.STAFF);
    const isManager = activity.program.programManagers.some((manager) => manager.id === query.actor.id);

    if (!isAdmin && !isManager) throw new ForbiddenException('Vous ne gérez pas ce programme');

    return activity;
  }
}
