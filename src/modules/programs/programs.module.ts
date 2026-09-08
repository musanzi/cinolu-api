import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { ProgramsController } from './controllers';
import { Program } from './entities';
import { QueryHandlers } from './queries/handlers';
import { ProgramSubscriber } from './subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([Program])],
  controllers: [ProgramsController],
  providers: [ProgramSubscriber, ...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule]
})
export class ProgramsModule {}
