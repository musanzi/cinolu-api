import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venture } from '../../entities';
import { FindVentureById } from '../impl';

@QueryHandler(FindVentureById)
export class FindVentureByIdHandler implements IQueryHandler<FindVentureById, Venture> {
  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  async execute(query: FindVentureById): Promise<Venture> {
    const venture = await this.repository.findOne({ where: { id: query.id }, relations: { owner: true } });

    if (!venture) throw new NotFoundException('Initiative introuvable');

    return venture;
  }
}
