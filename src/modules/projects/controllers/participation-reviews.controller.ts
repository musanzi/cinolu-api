import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CurrentUser } from '@musanzi/nestjs-session-auth';
import { User } from '@/modules/users/entities/user.entity';
import { ReviewParticipationDto } from '../dto/review-participation.dto';
import { ProjectParticipation } from '../entities/project-participation.entity';
import { ParticipationReviewsService } from '../services/participation-reviews.service';

@Controller('projects')
export class ParticipationReviewsController {
  constructor(private readonly reviewsService: ParticipationReviewsService) {}

  @Patch('participations/:participationId/review')
  reviewParticipation(
    @Param('participationId') participationId: string,
    @CurrentUser() user: User,
    @Body() dto: ReviewParticipationDto
  ): Promise<ProjectParticipation> {
    return this.reviewsService.reviewParticipation(participationId, user, dto);
  }
}
