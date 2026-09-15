import { CurrentUser, HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { IUserResponse } from '@/modules/users/interfaces';
import { AbstractController } from '@/shared/abstracts';
import { Controller, Get, Query } from '@nestjs/common';
import { FindStatsDto } from '../dto';
import { IStatsDashboard, IUserStatsDashboard } from '../interfaces';
import { FindStats, FindUserStats } from '../queries';

@Controller('stats')
export class StatsController extends AbstractController {
  @Get('mine')
  findMine(@CurrentUser() user: IUserResponse, @Query() query: FindStatsDto): Promise<IUserStatsDashboard> {
    return this.queryHandler.execute(new FindUserStats(user.id, query.months));
  }

  @Get()
  @HasRoles([Roles.STAFF])
  findAll(@Query() query: FindStatsDto): Promise<IStatsDashboard> {
    return this.queryHandler.execute(new FindStats(query.months));
  }
}
