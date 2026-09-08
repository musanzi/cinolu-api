import { FindProgramById } from '@/modules/programs/queries';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../entities';
import { FindActivityById } from '../../queries';
import { CreateActivity } from '../impl';

@CommandHandler(CreateActivity)
export class CreateActivityHandler implements ICommandHandler<CreateActivity, Activity> {
  private readonly logger = new Logger(CreateActivityHandler.name);

  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: CreateActivity): Promise<Activity> {
    try {
      const { programId, mentorIds, typeIds, categoryIds, ...fields } = command.createActivityDto;

      await this.queryBus.execute(new FindProgramById(programId));

      const created = await this.repository.save(
        this.repository.create({
          ...fields,
          program: { id: programId },
          mentors: mentorIds?.map((id) => ({ id })),
          types: typeIds?.map((id) => ({ id })),
          categories: categoryIds?.map((id) => ({ id }))
        })
      );
      return await this.queryBus.execute(new FindActivityById(created.id));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;

      this.logger.error(`Create activity failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException("Création de l'activité impossible");
    }
  }
}
