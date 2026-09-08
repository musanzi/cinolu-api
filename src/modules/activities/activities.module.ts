import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { ActivitiesController } from './controllers/activities.controller';
import { Activity } from './entities';
import { QueryHandlers } from './queries/handlers';
import { ActivitySubscriber } from './subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivitiesController],
  providers: [ActivitySubscriber, ...CommandHandlers, ...QueryHandlers]
})
export class ActivitiesModule {}
