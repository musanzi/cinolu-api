import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AbstractController } from '@/shared/abstracts';
import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { CreatePortfolio, DeletePortfolio, UpdatePortfolio } from '../commands';
import { CreatePortfolioDto, UpdatePortfolioDto } from '../dto';
import { Portfolio } from '../entities/portfolio.entity';
import { IFilterPortfolios } from '../interfaces';
import { FindPortfolioById, FindPortfolios } from '../queries';

@Controller('portfolios')
export class PortfoliosController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  create(@Body() dto: CreatePortfolioDto): Promise<Portfolio> {
    return this.commandHandler.execute(new CreatePortfolio(dto));
  }

  @Get()
  findAll(@Query() query: IFilterPortfolios): Promise<[Portfolio[], number]> {
    return this.queryHandler.execute(new FindPortfolios(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Portfolio> {
    return this.queryHandler.execute(new FindPortfolioById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  update(@Param('id') id: string, @Body() dto: UpdatePortfolioDto): Promise<Portfolio> {
    return this.commandHandler.execute(new UpdatePortfolio(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeletePortfolio(id));
  }
}
