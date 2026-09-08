import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { PortfoliosController } from './controllers';
import { Portfolio } from './entities';
import { QueryHandlers } from './queries/handlers';
import { PortfolioSubscriber } from './subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio])],
  controllers: [PortfoliosController],
  providers: [PortfolioSubscriber, ...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule]
})
export class PortfoliosModule {}
