import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectParticipation } from '../entities/project-participation.entity';
import { User } from '@/modules/users/entities/user.entity';
import { ReviewParticipationDto } from '../dto/review-participation.dto';
import { ProjectParticipationStatus } from '../types/project-participation-status.enum';
import { Role } from '@/core/auth/enums/roles.enum';
import { ProjectNotificationService } from './project-notifications.service';
import { ProjectParticipationService } from './project-participations.service';

@Injectable()
export class ParticipationReviewsService {
  constructor(
    @InjectRepository(ProjectParticipation)
    private readonly participationRepository: Repository<ProjectParticipation>,
    private readonly participationService: ProjectParticipationService,
    private readonly notificationService: ProjectNotificationService
  ) {}

  async reviewParticipation(
    participationId: string,
    reviewer: User,
    dto: ReviewParticipationDto
  ): Promise<ProjectParticipation> {
    if (dto.status === ProjectParticipationStatus.INFO_REQUESTED && !dto.review_message) {
      throw new BadRequestException("Un message est requis lors de la demande d'informations");
    }
    try {
      const participation = await this.findParticipationForReview(participationId);
      this.ensureReviewerCanManage(participation, reviewer);
      const nextPhase = this.resolveNextPhase(participation, dto.status);
      const updatedParticipation = await this.participationRepository.save({
        ...participation,
        ...dto,
        reviewed_at: new Date(),
        reviewed_by: { id: reviewer.id },
        phases: nextPhase ? this.appendPhase(participation.phases ?? [], nextPhase) : participation.phases
      });
      const savedParticipation = await this.participationService.findOne(updatedParticipation.id);
      await this.notificationService.notifyReviewAction(savedParticipation, reviewer, dto.status);
      return savedParticipation;
    } catch {
      throw new BadRequestException('Impossible de réviser la participation');
    }
  }

  private async findParticipationForReview(participationId: string): Promise<ProjectParticipation> {
    try {
      return await this.participationRepository.findOneOrFail({
        where: { id: participationId },
        relations: [
          'user',
          'project',
          'project.project_manager',
          'project.phases',
          'project.phases.mentors',
          'project.phases.mentors.owner',
          'phases',
          'phases.mentors',
          'phases.mentors.owner'
        ]
      });
    } catch {
      throw new NotFoundException('Participation introuvable');
    }
  }

  private ensureReviewerCanManage(participation: ProjectParticipation, reviewer: User): void {
    const reviewerRoles = reviewer.roles?.map((role) => role.name) ?? [];
    if (reviewerRoles.includes(Role.STAFF) || reviewerRoles.includes(Role.ADMIN)) return;
    if (participation.project?.project_manager?.id === reviewer.id) return;
    const canManageAsMentor = (participation.phases ?? []).some((phase) =>
      (phase.mentors ?? []).some((mentor) => mentor.owner?.id === reviewer.id)
    );
    if (canManageAsMentor) return;
    throw new ForbiddenException('Accès refusé');
  }

  private resolveNextPhase(participation: ProjectParticipation, status: ProjectParticipationStatus) {
    if (status !== ProjectParticipationStatus.QUALIFIED) return null;
    const phases = [...(participation.project?.phases ?? [])].sort(
      (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
    );
    if (phases.length === 0) return null;
    const currentPhaseIds = new Set((participation.phases ?? []).map((phase) => phase.id));
    if (currentPhaseIds.size === 0) return phases[0];
    let latestIndex = -1;
    phases.forEach((phase, index) => {
      if (currentPhaseIds.has(phase.id) && index > latestIndex) latestIndex = index;
    });
    const nextPhase = phases[latestIndex + 1];
    if (!nextPhase || currentPhaseIds.has(nextPhase.id)) return null;
    return nextPhase;
  }

  private appendPhase(phases: ProjectParticipation['phases'], nextPhase: ProjectParticipation['phases'][number]) {
    if (phases.some((phase) => phase.id === nextPhase.id)) return phases;
    return [...phases, nextPhase];
  }
}
