import { CurrentUser, HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { IUserResponse } from '@/modules/users/interfaces';
import { AbstractController } from '@/shared/abstracts';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FindStatsDto, StatsDashboardDto, UserStatsDashboardDto } from '../dto';
import { IStatsDashboard, IUserStatsDashboard } from '../interfaces';
import { FindStats, FindUserStats } from '../queries';

@ApiTags('stats')
@Controller('stats')
export class StatsController extends AbstractController {
  @Get('mine')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Get dashboard statistics for the current user' })
  @ApiOkResponse({ description: 'Current user statistics dashboard', type: UserStatsDashboardDto })
  findMine(@CurrentUser() user: IUserResponse, @Query() query: FindStatsDto): Promise<IUserStatsDashboard> {
    return this.queryHandler.execute(new FindUserStats(user.id, query.months));
  }

  @Get()
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Get platform-wide dashboard statistics (Staff only)' })
  @ApiOkResponse({ description: 'Platform-wide statistics dashboard', type: StatsDashboardDto })
  findAll(@Query() query: FindStatsDto): Promise<IStatsDashboard> {
    return this.queryHandler.execute(new FindStats(query.months));
  }
}
