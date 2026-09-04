import { Provider } from '@nestjs/common';
import { FindPortfolioByIdHandler } from './find-portfolio-by-id.handler';
import { FindPortfoliosHandler } from './find-portfolios.handler';

export const QueryHandlers: Provider[] = [FindPortfoliosHandler, FindPortfolioByIdHandler];
