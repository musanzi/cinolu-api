import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities';
import { PortfoliosController } from './controllers';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { PortfolioSubscriber } from './subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio])],
  controllers: [PortfoliosController],
  providers: [PortfolioSubscriber, ...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule]
})
export class PortfoliosModule {}
