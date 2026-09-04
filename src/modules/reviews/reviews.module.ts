import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityReview } from './entities';
import { ReviewsController } from './controllers';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
@Module({
  imports: [TypeOrmModule.forFeature([ActivityReview])],
  controllers: [ReviewsController],
  providers: [...CommandHandlers, ...QueryHandlers]
})
export class ReviewsModule {}
