import { BadRequestException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MailerService } from '@nestjs-modules/mailer';
import { buildEmailBody } from '@/shared/helpers';
import { ResetPasswordRequestedEvent } from '../impl';

@EventsHandler(ResetPasswordRequestedEvent)
export class SendResetPasswordEmailHandler implements IEventHandler<ResetPasswordRequestedEvent> {
  constructor(private mailerService: MailerService) {}

  async handle(event: ResetPasswordRequestedEvent): Promise<void> {
    try {
      const content = buildEmailBody({
        title: 'Réinitialisation du mot de passe',
        greetingName: event.user.name,
        intro: 'Nous avons reçu une demande de réinitialisation de votre mot de passe.',
        action: {
          label: 'Réinitialiser mon mot de passe',
          url: event.link
        },
        note: "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email."
      });

      await this.mailerService.sendMail({
        to: event.user.email,
        subject: 'Réinitialisation du mot de passe',
        ...content
      });
    } catch {
      throw new BadRequestException("Envoi d'email impossible");
    }
  }
}
