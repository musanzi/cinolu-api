import { Provider } from '@nestjs/common';
import { CreateProgramHandler } from './create-program.handler';
import { DeleteProgramHandler } from './delete-program.handler';
import { UpdateProgramHandler } from './update-program.handler';

export const CommandHandlers: Provider[] = [CreateProgramHandler, UpdateProgramHandler, DeleteProgramHandler];
