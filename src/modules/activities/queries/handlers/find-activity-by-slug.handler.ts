import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../entities';
import { FindActivityBySlug } from '../impl';

@QueryHandler(FindActivityBySlug)
export class FindActivityBySlugHandler implements IQueryHandler<FindActivityBySlug, Activity> {
  private readonly logger = new Logger(FindActivityBySlugHandler.name);

  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>
  ) {}

  async execute(query: FindActivityBySlug): Promise<Activity> {
    try {
      return await this.repository.findOneOrFail({
        where: { slug: query.slug, isPublished: true },
        relations: ['program', 'mentors', 'types', 'categories']
      });
    } catch (error) {
      this.logger.error(
        `Find published activity by slug failed slug="${query.slug}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Activité introuvable');
    }
  }
}
