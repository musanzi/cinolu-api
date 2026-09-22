import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { CohortsController } from './controllers/cohorts.controller';
import { Cohort } from './entities';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [TypeOrmModule.forFeature([Cohort])],
  controllers: [CohortsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule]
})
export class CohortsModule {}
