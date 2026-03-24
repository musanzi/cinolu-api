import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsService } from '@/modules/notifications/services/notifications.service';
import { Notification } from '@/modules/notifications/entities/notification.entity';
import { CreateNotificationDto } from '@/modules/notifications/dto/create-notification.dto';
import { User } from '@/modules/users/entities/user.entity';
import { ProjectsService } from './projects.service';
import { ProjectParticipationService } from './project-participations.service';
import { MentorsService } from '@/modules/mentors/services/mentors.service';
import { UsersService } from '@/modules/users/services/users.service';
import { ProjectParticipationStatus } from '../types/project-participation-status.enum';
import { ProjectParticipation } from '../entities/project-participation.entity';

@Injectable()
export class ProjectNotificationService {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly projectsService: ProjectsService,
    @Inject(forwardRef(() => ProjectParticipationService))
    private readonly participationService: ProjectParticipationService,
    private readonly mentorsService: MentorsService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async create(projectId: string, user: User, dto: CreateNotificationDto): Promise<Notification> {
    try {
      await this.projectsService.findOne(projectId);
      const notification = await this.notificationsService.create(projectId, user.id, dto);
      return this.notificationsService.findOne(notification.id);
    } catch {
      throw new BadRequestException('Création de notification impossible');
    }
  }

  async send(notificationId: string): Promise<Notification> {
    try {
      const notification = await this.notificationsService.findOne(notificationId);
      let recipients = [];
      if (notification.notify_staff) {
        recipients = await this.usersService.findStaff();
      } else if (notification.notify_mentors) {
        recipients = await this.mentorsService.findUsersByPhase(notification.phase.id);
      } else if (notification.phase) {
        recipients = await this.participationService.findByPhase(notification.phase.id);
      } else {
        recipients = await this.participationService.findByProject(notification.project.id);
      }
      this.eventEmitter.emit('notify.participants', recipients, notification);
      return await this.notificationsService.send(notificationId);
    } catch {
      throw new BadRequestException('Envoi de notification impossible');
    }
  }

  async notifyReviewAction(
    participation: ProjectParticipation,
    reviewer: User,
    status: ProjectParticipationStatus
  ): Promise<void> {
    const participantRecipient = participation.user ? [participation.user] : [];
    const mentorRecipients = await this.resolveMentorRecipients(participation);
    const participantNotification = this.buildReviewNotification(participation, reviewer, status, false);
    const mentorNotification = this.buildReviewNotification(participation, reviewer, status, true);
    this.eventEmitter.emit('notify.participants', participantRecipient, participantNotification);
    this.eventEmitter.emit('notify.participants', mentorRecipients, mentorNotification);
  }

  private async resolveMentorRecipients(participation: ProjectParticipation): Promise<User[]> {
    const phaseIds = (participation.phases ?? []).map((phase) => phase.id);
    const recipients = await Promise.all(phaseIds.map((phaseId) => this.mentorsService.findUsersByPhase(phaseId)));
    return this.deduplicateUsers(recipients.flat());
  }

  private deduplicateUsers(users: User[]): User[] {
    const seen = new Set<string>();
    return users
      .filter((user) => !!user)
      .filter((user) => {
        if (seen.has(user.id)) return false;
        seen.add(user.id);
        return true;
      });
  }

  private buildReviewNotification(
    participation: ProjectParticipation,
    reviewer: User,
    status: ProjectParticipationStatus,
    forMentors: boolean
  ): Notification {
    const reviewerName = reviewer.name || reviewer.email || 'Un responsable';
    const participationOwner = participation.user?.name || participation.user?.email || 'Participant';
    const statusLabel = this.mapStatusLabel(status);
    const message = participation.review_message
      ? `<p><strong>Message:</strong> ${participation.review_message}</p>`
      : '';
    const body = forMentors
      ? `<p>La participation de <strong>${participationOwner}</strong> pour le projet <strong>${participation.project?.name}</strong> est maintenant <strong>${statusLabel}</strong>.</p><p><strong>Revu par:</strong> ${reviewerName}</p>${message}`
      : `<p>Votre participation pour le projet <strong>${participation.project?.name}</strong> est maintenant <strong>${statusLabel}</strong>.</p><p><strong>Revu par:</strong> ${reviewerName}</p>${message}`;
    return {
      title: 'Mise à jour de participation',
      body,
      project: participation.project,
      attachments: []
    } as Notification;
  }

  private mapStatusLabel(status: ProjectParticipationStatus): string {
    const labels = {
      [ProjectParticipationStatus.PENDING]: 'en attente',
      [ProjectParticipationStatus.IN_REVIEW]: 'en revue',
      [ProjectParticipationStatus.QUALIFIED]: 'qualifiée',
      [ProjectParticipationStatus.DISQUALIFIED]: 'disqualifiée',
      [ProjectParticipationStatus.INFO_REQUESTED]: 'information demandée'
    };
    return labels[status];
  }
}
