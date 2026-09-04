import { Provider } from '@nestjs/common';
import { DeleteReviewHandler } from './delete-review.handler';
import { SaveReviewHandler } from './save-review.handler';
import { UpdateReviewHandler } from './update-review.handler';

export const CommandHandlers: Provider[] = [DeleteReviewHandler, SaveReviewHandler, UpdateReviewHandler];
