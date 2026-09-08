import { SectorsModule } from '@/modules/sectors/sectors.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { VenturesController } from './controllers';
import { Venture } from './entities';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';
import { VentureSubscriber } from './subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([Venture]), SectorsModule],
  controllers: [VenturesController],
  providers: [VentureSubscriber, ...CommandHandlers, ...QueryHandlers, ...EventHandlers]
})
export class VenturesModule {}
