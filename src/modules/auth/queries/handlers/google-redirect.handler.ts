import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { GoogleRedirect } from '../impl';

@QueryHandler(GoogleRedirect)
export class GoogleRedirectHandler implements IQueryHandler<GoogleRedirect, void> {
  constructor(private readonly configService: ConfigService) {}

  async execute(query: GoogleRedirect): Promise<void> {
    const frontendUri = this.configService.get<string>('FRONTEND_URI');

    query.response.redirect(frontendUri);
  }
}
