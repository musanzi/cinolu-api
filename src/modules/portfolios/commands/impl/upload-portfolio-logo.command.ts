import { Command } from '@nestjs/cqrs';
import { Portfolio } from '../../entities';

export class UploadPortfolioLogo extends Command<Portfolio> {
  constructor(
    public readonly portfolioId: string,
    public readonly file: Express.Multer.File
  ) {
    super();
  }
}
