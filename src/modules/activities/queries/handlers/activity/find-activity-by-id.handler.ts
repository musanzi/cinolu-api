import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../../entities/activity.entity';
import { isActivityOngoing, isAdmin } from '../../../helpers';
import { FindActivityById } from '../../impl';

@QueryHandler(FindActivityById)
export class FindActivityByIdHandler implements IQueryHandler<FindActivityById, Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>
  ) {}

  async execute(query: FindActivityById): Promise<Activity> {
    const activity = await this.repository.findOne({
      where: { id: query.id },
      relations: { program: { programManagers: true }, type: true, categories: true }
    });

    if (!activity) throw new NotFoundException('Activité introuvable');

    const manager = activity.program.programManagers.some((user) => user.id === query.actor.id);

    if (!isActivityOngoing(activity) && !isAdmin(query.actor) && !manager) throw new ForbiddenException('Accès refusé');

    return activity;
  }
}
