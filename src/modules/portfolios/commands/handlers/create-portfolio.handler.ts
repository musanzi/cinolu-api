import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../../entities';
import { CreatePortfolio } from '../impl';

@CommandHandler(CreatePortfolio)
export class CreatePortfolioHandler implements ICommandHandler<CreatePortfolio, Portfolio> {
  private readonly logger = new Logger(CreatePortfolioHandler.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>
  ) {}

  async execute(command: CreatePortfolio): Promise<Portfolio> {
    try {
      const portfolio = this.repository.create(command.createPortfolioDto);

      return await this.repository.save(portfolio);
    } catch (error) {
      this.logger.error(`Create portfolio failed: ${error instanceof Error ? error.message : String(error)}`);

      throw new BadRequestException('Création du portefeuille impossible');
    }
  }
}
