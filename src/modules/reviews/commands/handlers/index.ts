import { Provider } from '@nestjs/common';
import { CreateReviewHandler } from './create-review.handler';
import { UpdateReviewHandler } from './update-review.handler';

export const CommandHandlers: Provider[] = [CreateReviewHandler, UpdateReviewHandler];
