import { Query } from '@nestjs/cqrs';
import { Response } from 'express';
import { IFilterUsers } from '../../interfaces';

export class ExportUsersCsv extends Query<void> {
  constructor(
    public readonly params: IFilterUsers,
    public readonly response: Response
  ) {
    super();
  }
}
