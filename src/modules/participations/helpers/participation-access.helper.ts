import { ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IUserResponse } from '@/modules/users/interfaces';
import { Roles } from '@/modules/auth/enums';
import { ActivityParticipation } from '../entities/activity-participation.entity';

export async function assertParticipationManager(
  repository: Repository<ActivityParticipation>,
  participationId: string,
  actor: IUserResponse
): Promise<void> {
  if (actor.roles?.includes(Roles.STAFF)) return;

  const allowed = await repository
    .createQueryBuilder('participation')
    .innerJoin('participation.activity', 'activity')
    .innerJoin('activity.program', 'program')
    .innerJoin('program.programManagers', 'manager', 'manager.id = :userId', { userId: actor.id })
    .where('participation.id = :id', { id: participationId })
    .getExists();

  if (!allowed) throw new ForbiddenException('Accès refusé');
}
