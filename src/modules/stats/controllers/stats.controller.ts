import { Controller, Get, Query } from '@nestjs/common';
import { AbstractController } from '@/shared/abstracts';
import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { FindStatsDto } from '../dto';
import { IStatsDashboard } from '../interfaces';
import { FindStats } from '../queries';

@Controller('stats')
export class StatsController extends AbstractController {
  @Get()
  @HasRoles([Roles.STAFF])
  findAll(@Query() query: FindStatsDto): Promise<IStatsDashboard> {
    return this.queryHandler.execute(new FindStats(query.months));
  }
}
