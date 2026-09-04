import { BadRequestException, ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Portfolio } from '../../entities/portfolio.entity';
import { UpdatePortfolio } from '../impl';

@CommandHandler(UpdatePortfolio)
export class UpdatePortfolioHandler implements ICommandHandler<UpdatePortfolio, Portfolio> {
  private readonly logger = new Logger(UpdatePortfolioHandler.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>
  ) {}

  async execute(command: UpdatePortfolio): Promise<Portfolio> {
    const { id, updatePortfolioDto } = command;
    const portfolio = await this.repository.findOneBy({ id: command.id });

    if (!portfolio) throw new NotFoundException('Portefeuille introuvable');

    const updatedPortfolio = this.repository.merge(portfolio, updatePortfolioDto);

    try {
      return await this.repository.save(updatedPortfolio);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      ) {
        throw new ConflictException('Un portefeuille avec ce nom existe déjà');
      }

      this.logger.error(
        `Update portfolio failed id="${id}": ${error instanceof Error ? error.message : String(error)}`
      );

      throw new BadRequestException('Modification du portefeuille impossible');
    }
  }
}
