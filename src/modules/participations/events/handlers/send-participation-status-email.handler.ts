import { buildEmailBody } from '@/shared/helpers';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ParticipationStatusChangedEvent } from '../impl';

@EventsHandler(ParticipationStatusChangedEvent)
export class SendParticipationStatusEmailHandler implements IEventHandler<ParticipationStatusChangedEvent> {
  private readonly logger = new Logger(SendParticipationStatusEmailHandler.name);

  constructor(private readonly mailerService: MailerService) {}

  async handle(event: ParticipationStatusChangedEvent): Promise<void> {
    const { participation } = event;

    try {
      const content = buildEmailBody({
        title: `Statut de votre participation à ${participation.activity.name}`,
        greetingName: participation.participant.name,
        intro: `Le statut de votre participation à l'activité « ${participation.activity.name} » est maintenant : ${participation.status}.`
      });

      await this.mailerService.sendMail({
        to: participation.participant.email,
        subject: `Mise à jour de votre participation à ${participation.activity.name}`,
        ...content
      });
    } catch (error) {
      this.logger.error(
        `Participation status email failed id="${participation.id}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
