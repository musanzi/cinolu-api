import { BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Portfolio } from '../../entities/portfolio.entity';
import { CreatePortfolio } from '../impl';

@CommandHandler(CreatePortfolio)
export class CreatePortfolioHandler implements ICommandHandler<CreatePortfolio, Portfolio> {
  private readonly logger = new Logger(CreatePortfolioHandler.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>
  ) {}

  async execute(command: CreatePortfolio): Promise<Portfolio> {
    const { createPortfolioDto } = command;

    try {
      return await this.repository.save(
        this.repository.create({
          ...createPortfolioDto
        })
      );
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      ) {
        throw new ConflictException('Un portefeuille avec ce nom existe déjà');
      }

      this.logger.error(`Create portfolio failed: ${error instanceof Error ? error.message : String(error)}`);

      throw new BadRequestException('Création du portefeuille impossible');
    }
  }
}
