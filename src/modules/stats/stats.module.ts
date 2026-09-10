import { Module } from '@nestjs/common';
import { StatsController } from './controllers';
import { QueryHandlers } from './queries/handlers';

@Module({
  controllers: [StatsController],
  providers: [...QueryHandlers]
})
export class StatsModule {}
