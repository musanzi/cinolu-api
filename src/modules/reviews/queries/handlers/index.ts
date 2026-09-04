import { Provider } from '@nestjs/common';
import { FindActivityReviewsHandler } from './find-activity-reviews.handler';
import { FindMyReviewsHandler } from './find-my-reviews.handler';
import { FindReviewByIdHandler } from './find-review-by-id.handler';
import { GetReviewStatisticsHandler } from './get-review-statistics.handler';
import { GetReviewAdminStatisticsHandler } from './get-review-admin-statistics.handler';

export const QueryHandlers: Provider[] = [
  FindMyReviewsHandler,
  FindActivityReviewsHandler,
  FindReviewByIdHandler,
  GetReviewStatisticsHandler,
  GetReviewAdminStatisticsHandler
];
