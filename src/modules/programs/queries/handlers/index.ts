import { Provider } from '@nestjs/common';
import { FindProgramByIdHandler } from './find-program-by-id.handler';
import { FindProgramsHandler } from './find-programs.handler';

export const QueryHandlers: Provider[] = [FindProgramsHandler, FindProgramByIdHandler];
