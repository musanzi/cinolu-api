import { Module } from '@nestjs/common';
import { StatsController } from './controllers/stats.controller';
import { QueryHandlers } from './queries/handlers';
import { UsersModule } from '@/modules/users/users.module';
import { ProgramsModule } from '@/modules/programs/programs.module';
import { ActivitiesModule } from '@/modules/activities/activities.module';
import { ParticipationsModule } from '@/modules/participations/participations.module';
import { ReviewsModule } from '@/modules/reviews/reviews.module';
import { VenturesModule } from '@/modules/ventures/ventures.module';

@Module({
  imports: [UsersModule, ProgramsModule, ActivitiesModule, ParticipationsModule, ReviewsModule, VenturesModule],
  controllers: [StatsController],
  providers: [...QueryHandlers]
})
export class StatsModule {}
