import { Query } from '@nestjs/cqrs';
import { Response } from 'express';
import { IUserResponse } from '@/modules/users/interfaces';
import { IFilterParticipations } from '../../interfaces';
export class ExportParticipationsCsv extends Query<void> {
  constructor(
    public readonly actor: IUserResponse,
    public readonly activityId: string,
    public readonly params: IFilterParticipations,
    public readonly response: Response
  ) {
    super();
  }
}
