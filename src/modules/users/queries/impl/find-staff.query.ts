import { Query } from '@nestjs/cqrs';
import { IUserResponse } from '../../interfaces';

export class FindStaff extends Query<IUserResponse[]> {}
