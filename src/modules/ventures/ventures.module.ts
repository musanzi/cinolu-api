import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { VentureCategoriesController, VenturesController } from './controllers';
import { Venture, VentureCategory } from './entities';
import { QueryHandlers } from './queries/handlers';
import { VentureSubscriber } from './subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([Venture, VentureCategory])],
  controllers: [VentureCategoriesController, VenturesController],
  providers: [VentureSubscriber, ...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule]
})
export class VenturesModule {}
