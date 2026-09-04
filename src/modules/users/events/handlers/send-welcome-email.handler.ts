import { BadRequestException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MailerService } from '@nestjs-modules/mailer';
import { buildEmailBody } from '@/shared/helpers';
import { WelcomeUserEvent } from '../impl';

@EventsHandler(WelcomeUserEvent)
export class SendWelcomeEmailHandler implements IEventHandler<WelcomeUserEvent> {
  constructor(private mailerService: MailerService) {}

  async handle(event: WelcomeUserEvent): Promise<void> {
    try {
      const content = buildEmailBody({
        title: 'Bienvenue sur Starter',
        greetingName: event.user.name,
        intro: 'Votre compte a bien été créé. Vous pouvez maintenant vous connecter et commencer à utiliser Starter.',
        highlight: event.defaultPassword
          ? {
              label: 'Mot de passe temporaire',
              value: event.defaultPassword
            }
          : undefined,
        note: event.defaultPassword
          ? 'Pour votre sécurité, changez ce mot de passe après votre première connexion.'
          : undefined
      });

      await this.mailerService.sendMail({
        to: event.user.email,
        subject: 'Bienvenue sur Starter',
        ...content
      });
    } catch {
      throw new BadRequestException("Envoi d'email impossible");
    }
  }
}
