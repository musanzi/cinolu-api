import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../entities';
import { FindActivityById } from '../impl';

@QueryHandler(FindActivityById)
export class FindActivityByIdHandler implements IQueryHandler<FindActivityById, Activity> {
  private readonly logger = new Logger(FindActivityByIdHandler.name);

  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>
  ) {}

  async execute(query: FindActivityById): Promise<Activity> {
    try {
      return await this.repository.findOneOrFail({
        where: { id: query.id },
        relations: ['mentors', 'types', 'categories']
      });
    } catch (error) {
      this.logger.error(
        `Find activity by id failed id="${query.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Activité introuvable');
    }
  }
}
