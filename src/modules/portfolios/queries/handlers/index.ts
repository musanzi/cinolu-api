import { Provider } from '@nestjs/common';
import { FindPortfolioByIdHandler } from './find-portfolio-by-id.handler';
import { FindPortfolioBySlugHandler } from './find-portfolio-by-slug.handler';
import { FindPortfoliosHandler } from './find-portfolios.handler';

export const QueryHandlers: Provider[] = [
  FindPortfoliosHandler,
  FindPortfolioByIdHandler,
  FindPortfolioBySlugHandler
];
