import { buildEmailBody } from '@/shared/helpers';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { VentureStatusChangedEvent } from '../impl';

@EventsHandler(VentureStatusChangedEvent)
export class SendVentureStatusEmailHandler implements IEventHandler<VentureStatusChangedEvent> {
  private readonly logger = new Logger(SendVentureStatusEmailHandler.name);
  constructor(private readonly mailerService: MailerService) {}

  async handle(event: VentureStatusChangedEvent): Promise<void> {
    const { venture } = event;

    try {
      const content = buildEmailBody({
        title: `Statut de ${venture.name}`,
        greetingName: venture.owner.name,
        intro: `Le statut de votre initiative « ${venture.name} » est maintenant : ${venture.status}.`
      });

      await this.mailerService.sendMail({
        to: venture.owner.email,
        subject: `Mise à jour de votre initiative ${venture.name}`,
        ...content
      });
    } catch (error) {
      this.logger.error(
        `Venture status email failed id="${venture.id}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
