import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityParticipation } from './entities';
import { ParticipationsController } from './controllers';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
@Module({
  imports: [TypeOrmModule.forFeature([ActivityParticipation])],
  controllers: [ParticipationsController],
  providers: [...CommandHandlers, ...QueryHandlers]
})
export class ParticipationsModule {}
