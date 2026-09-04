import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '@/modules/auth/enums';
import { ActivityParticipation } from '../../entities/activity-participation.entity';
import { assertParticipationManager } from '../../helpers';
import { FindParticipationById } from '../impl';

@QueryHandler(FindParticipationById)
export class FindParticipationByIdHandler implements IQueryHandler<FindParticipationById, ActivityParticipation> {
  constructor(
    @InjectRepository(ActivityParticipation)
    private readonly repository: Repository<ActivityParticipation>
  ) {}

  async execute(query: FindParticipationById): Promise<ActivityParticipation> {
    const participation = await this.repository.findOne({
      where: { id: query.id },
      relations: { activity: { program: true }, user: true }
    });

    if (!participation) throw new NotFoundException('Participation introuvable');

    if (participation.userId !== query.actor.id) {
      if (!query.actor.roles?.includes(Roles.STAFF))
        await assertParticipationManager(this.repository, query.id, query.actor);
    }

    return participation;
  }
}
