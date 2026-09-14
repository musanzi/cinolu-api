import { Query } from '@nestjs/cqrs';
import { Program } from '../../entities';

export class FindRecentPrograms extends Query<Program[]> {}
