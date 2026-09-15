import { Provider } from '@nestjs/common';
import { FindMyReviewsHandler } from './find-my-reviews.handler';
import { FindReviewByIdHandler } from './find-review-by-id.handler';
import { FindReviewsHandler } from './find-reviews.handler';

export const QueryHandlers: Provider[] = [FindReviewByIdHandler, FindMyReviewsHandler, FindReviewsHandler];
