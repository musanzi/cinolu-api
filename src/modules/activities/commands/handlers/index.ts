import { Provider } from '@nestjs/common';
import { CreateActivityHandler } from './create-activity.handler';
import { DeleteActivityHandler } from './delete-activity.handler';
import { ToggleActivityPublicationHandler } from './toggle-activity-publication.handler';
import { UpdateActivityHandler } from './update-activity.handler';
import { UploadActivityCoverHandler } from './upload-activity-cover.handler';

export const CommandHandlers: Provider[] = [
  CreateActivityHandler,
  UpdateActivityHandler,
  DeleteActivityHandler,
  ToggleActivityPublicationHandler,
  UploadActivityCoverHandler
];
