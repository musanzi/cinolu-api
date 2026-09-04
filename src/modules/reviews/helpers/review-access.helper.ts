import { ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Roles } from '@/modules/auth/enums';
import { IUserResponse } from '@/modules/users/interfaces';
import { ActivityReview } from '../entities/activity-review.entity';

export async function assertReviewManager(
  repository: Repository<ActivityReview>,
  reviewId: string,
  actor: IUserResponse
): Promise<void> {
  if (actor.roles?.includes(Roles.STAFF)) return;

  const allowed = await repository
    .createQueryBuilder('review')
    .innerJoin('review.activity', 'activity')
    .innerJoin('activity.program', 'program')
    .innerJoin('program.programManagers', 'manager', 'manager.id = :userId', { userId: actor.id })
    .where('review.id = :id', { id: reviewId })
    .getExists();

  if (!allowed) throw new ForbiddenException('Accès refusé');
}
