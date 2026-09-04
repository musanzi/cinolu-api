import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venture } from '../../entities';
import { VentureStatus } from '../../interfaces';
import { FindPublishedVentureBySlug } from '../impl';

@QueryHandler(FindPublishedVentureBySlug)
export class FindPublishedVentureBySlugHandler implements IQueryHandler<FindPublishedVentureBySlug, Venture> {
  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  async execute(query: FindPublishedVentureBySlug): Promise<Venture> {
    const venture = await this.repository.findOneBy({ slug: query.slug, status: VentureStatus.PUBLISHED });

    if (!venture) throw new NotFoundException('Initiative introuvable');

    return venture;
  }
}
