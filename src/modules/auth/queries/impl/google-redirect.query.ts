import { Query } from '@nestjs/cqrs';
import { Response } from 'express';

export class GoogleRedirect extends Query<void> {
  constructor(
    public readonly response: Response,
    public readonly state?: unknown
  ) {
    super();
  }
}
