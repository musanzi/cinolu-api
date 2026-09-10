import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { ParticipationsController } from './controllers';
import { Participation } from './entities';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [TypeOrmModule.forFeature([Participation])],
  controllers: [ParticipationsController],
  providers: [...CommandHandlers, ...QueryHandlers, ...EventHandlers]
})
export class ParticipationsModule {}
