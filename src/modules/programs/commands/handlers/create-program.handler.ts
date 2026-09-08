import { FindPortfolioById } from '@/modules/portfolios/queries';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities';
import { FindProgramById } from '../../queries';
import { CreateProgram } from '../impl';

@CommandHandler(CreateProgram)
export class CreateProgramHandler implements ICommandHandler<CreateProgram, Program> {
  private readonly logger = new Logger(CreateProgramHandler.name);

  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: CreateProgram): Promise<Program> {
    try {
      const { portfolioId, managers, ...fields } = command.createProgramDto;

      await this.queryBus.execute(new FindPortfolioById(portfolioId));

      const program = this.repository.create({
        ...fields,
        portfolio: { id: portfolioId },
        managers: managers?.map((id) => ({ id }))
      });

      const created = await this.repository.save(program);

      return await this.queryBus.execute(new FindProgramById(created.id));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;

      this.logger.error(`Create program failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException('Création du programme impossible');
    }
  }
}
