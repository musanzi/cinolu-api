import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities';
import { ProgramsController } from './controllers';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { ProgramSubscriber } from './subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([Program])],
  controllers: [ProgramsController],
  providers: [ProgramSubscriber, ...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule]
})
export class ProgramsModule {}
