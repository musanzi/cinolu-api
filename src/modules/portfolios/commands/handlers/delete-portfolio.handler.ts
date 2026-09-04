import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../../entities/portfolio.entity';
import { DeletePortfolio } from '../impl';

@CommandHandler(DeletePortfolio)
export class DeletePortfolioHandler implements ICommandHandler<DeletePortfolio, void> {
  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>
  ) {}

  async execute(command: DeletePortfolio): Promise<void> {
    const result = await this.repository.softDelete(command.id);

    if (!result.affected) throw new NotFoundException('Portefeuille introuvable');
  }
}
