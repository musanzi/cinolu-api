import { Provider } from '@nestjs/common';
import { FindProgramByIdHandler } from './find-program-by-id.handler';
import { FindProgramsByPortfolioSlugHandler } from './find-programs-by-portfolio-slug.handler';
import { FindProgramsHandler } from './find-programs.handler';

export const QueryHandlers: Provider[] = [
  FindProgramsHandler,
  FindProgramByIdHandler,
  FindProgramsByPortfolioSlugHandler
];
