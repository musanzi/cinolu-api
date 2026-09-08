import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '../../interfaces';

export class FindMentors extends Query<IUserResponse[]> {}
