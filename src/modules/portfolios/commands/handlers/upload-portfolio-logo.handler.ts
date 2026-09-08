import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { Repository } from 'typeorm';
import { Portfolio } from '../../entities';
import { FindPortfolioById } from '../../queries';
import { UploadPortfolioLogo } from '../impl';

@CommandHandler(UploadPortfolioLogo)
export class UploadPortfolioLogoHandler implements ICommandHandler<UploadPortfolioLogo, Portfolio> {
  private readonly logger = new Logger(UploadPortfolioLogoHandler.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UploadPortfolioLogo): Promise<Portfolio> {
    const { portfolioId, file } = command;

    try {
      const portfolio = await this.queryBus.execute(new FindPortfolioById(portfolioId));

      if (portfolio.logo) {
        await promises.rm(`./uploads/portfolios/${portfolio.logo}`, { force: true });
      }

      await this.repository.update(portfolio.id, { logo: file.filename });

      return await this.queryBus.execute(new FindPortfolioById(portfolio.id));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Upload portfolio logo failed id="${portfolioId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Ajout du logo du portefeuille impossible');
    }
  }
}
