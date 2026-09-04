import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'fast-csv';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { ExportUsersCsv } from '../impl';

@QueryHandler(ExportUsersCsv)
export class ExportUsersCsvHandler implements IQueryHandler<ExportUsersCsv, void> {
  private readonly logger = new Logger(ExportUsersCsvHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async execute(query: ExportUsersCsv): Promise<void> {
    const { q } = query.params;

    try {
      const queryBuilder = this.repository
        .createQueryBuilder('user')
        .select(['user.name', 'user.email'])
        .orderBy('user.updatedAt', 'DESC');
      if (q) {
        queryBuilder.where('user.name LIKE :q OR user.email LIKE :q', { q: `%${q}%` });
      }

      const users = await queryBuilder.getMany();
      const csvStream = format({ headers: ['Name', 'Email'] });
      csvStream.pipe(query.response);
      users.forEach((user) => {
        csvStream.write({ Name: user.name, Email: user.email });
      });
      csvStream.end();
    } catch (error) {
      this.logger.error(
        `Export users csv failed q="${q ?? ''}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Export des utilisateurs impossible');
    }
  }
}
