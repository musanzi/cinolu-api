import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from '../../entities';
import { FindParticipations } from '../impl';

@QueryHandler(FindParticipations)
export class FindParticipationsHandler implements IQueryHandler<FindParticipations, [Participation[], number]> {
  private readonly logger = new Logger(FindParticipationsHandler.name);

  constructor(@InjectRepository(Participation) private readonly repository: Repository<Participation>) {}

  async execute(query: FindParticipations): Promise<[Participation[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository
        .createQueryBuilder('participation')
        .leftJoinAndSelect('participation.participant', 'participant')
        .leftJoinAndSelect('participation.activity', 'activity')
        .orderBy('participation.updatedAt', 'DESC');

      if (query.params.activityId) {
        builder.andWhere('activity.id = :activityId', { activityId: query.params.activityId });
      }
      if (query.params.status) {
        builder.andWhere('participation.status = :status', { status: query.params.status });
      }

      return await builder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Find participations failed params="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Participations introuvables');
    }
  }
}
