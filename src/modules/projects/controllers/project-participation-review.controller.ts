import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CurrentUser, Rbac } from '@musanzi/nestjs-session-auth';
import { ParticipationReviewDto } from '../dto/participation-review.dto';
import { ProjectParticipationReview } from '../entities/project-participation-review.entity';
import { ProjectParticipationReviewService } from '../services/project-participation-review.service';
import { User } from '@/modules/users/entities/user.entity';

@Controller('projects')
export class ProjectParticipationReviewController {
  constructor(private readonly reviewService: ProjectParticipationReviewService) {}

  @Patch('participations/:participationId/review')
  @Rbac({ resource: 'projects', action: 'update' })
  review(
    @Param('participationId') participationId: string,
    @CurrentUser() user: User,
    @Body() dto: ParticipationReviewDto
  ): Promise<ProjectParticipationReview> {
    return this.reviewService.review(participationId, user, dto);
  }
}
