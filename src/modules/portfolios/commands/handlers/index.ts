import { Provider } from '@nestjs/common';
import { CreatePortfolioHandler } from './create-portfolio.handler';
import { DeletePortfolioHandler } from './delete-portfolio.handler';
import { UpdatePortfolioHandler } from './update-portfolio.handler';
import { UploadPortfolioLogoHandler } from './upload-portfolio-logo.handler';

export const CommandHandlers: Provider[] = [
  CreatePortfolioHandler,
  UpdatePortfolioHandler,
  DeletePortfolioHandler,
  UploadPortfolioLogoHandler
];
