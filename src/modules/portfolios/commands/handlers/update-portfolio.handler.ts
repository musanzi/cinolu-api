import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../../entities';
import { FindPortfolioById } from '../../queries';
import { UpdatePortfolio } from '../impl';

@CommandHandler(UpdatePortfolio)
export class UpdatePortfolioHandler implements ICommandHandler<UpdatePortfolio, Portfolio> {
  private readonly logger = new Logger(UpdatePortfolioHandler.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdatePortfolio): Promise<Portfolio> {
    try {
      const portfolio = await this.queryBus.execute(new FindPortfolioById(command.id));

      return await this.repository.save({
        ...portfolio,
        ...command.updatePortfolioDto
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Update portfolio failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Modification du portefeuille impossible');
    }
  }
}
