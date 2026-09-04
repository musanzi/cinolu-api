import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity, ActivityType, ActivityCategory } from './entities';
import { ActivitiesController, ActivityCategoriesController, ActivityTypesController } from './controllers';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { ActivitySubscriber } from './subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, ActivityType, ActivityCategory])],
  controllers: [ActivitiesController, ActivityCategoriesController, ActivityTypesController],
  providers: [ActivitySubscriber, ...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule]
})
export class ActivitiesModule {}
