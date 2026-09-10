import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from '../../entities';
import { FindMyParticipations } from '../impl';

@QueryHandler(FindMyParticipations)
export class FindMyParticipationsHandler implements IQueryHandler<FindMyParticipations, [Participation[], number]> {
  private readonly logger = new Logger(FindMyParticipationsHandler.name);

  constructor(@InjectRepository(Participation) private readonly repository: Repository<Participation>) {}

  async execute(query: FindMyParticipations): Promise<[Participation[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository
        .createQueryBuilder('participation')
        .leftJoinAndSelect('participation.activity', 'activity')
        .where('participation.participantId = :participantId', { participantId: query.participantId })
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
        `Find my participations failed participantId="${query.participantId}" params="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Participations introuvables');
    }
  }
}
