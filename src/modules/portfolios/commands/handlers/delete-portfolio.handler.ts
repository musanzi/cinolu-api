import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../../entities';
import { FindPortfolioById } from '../../queries';
import { DeletePortfolio } from '../impl';

@CommandHandler(DeletePortfolio)
export class DeletePortfolioHandler implements ICommandHandler<DeletePortfolio, void> {
  private readonly logger = new Logger(DeletePortfolioHandler.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeletePortfolio): Promise<void> {
    try {
      await this.queryBus.execute(new FindPortfolioById(command.id));
      await this.repository.softDelete(command.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Delete portfolio failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Suppression du portefeuille impossible');
    }
  }
}
