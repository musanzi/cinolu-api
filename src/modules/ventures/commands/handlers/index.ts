import { Provider } from '@nestjs/common';
import { CreateVentureHandler } from './create-venture.handler';
import { DeleteVentureHandler } from './delete-venture.handler';
import { UpdateVentureHandler } from './update-venture.handler';
import { UploadVentureImageHandler } from './upload-venture-image.handler';

export const CommandHandlers: Provider[] = [
  CreateVentureHandler,
  UpdateVentureHandler,
  DeleteVentureHandler,
  UploadVentureImageHandler
];
