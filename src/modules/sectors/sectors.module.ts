import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { SectorsController } from './controllers';
import { Sector } from './entities';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [TypeOrmModule.forFeature([Sector])],
  controllers: [SectorsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule]
})
export class SectorsModule {}
