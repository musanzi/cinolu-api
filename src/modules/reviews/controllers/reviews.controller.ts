import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AbstractController } from '@/shared/abstracts';
import { CurrentUser } from '@/modules/auth/decorators';
import { IUserResponse } from '@/modules/users/interfaces';
import { DeleteReview, SaveReview, UpdateReview } from '../commands';
import { SaveReviewDto } from '../dto';
import { ActivityReview } from '../entities/activity-review.entity';
import { IFilterReviews, IReviewStatistics } from '../interfaces';
import { FindActivityReviews, FindMyReviews, FindReviewById, GetReviewStatistics } from '../queries';

@Controller('reviews')
export class ReviewsController extends AbstractController {
  @Post('activities/:activityId')
  create(
    @CurrentUser() actor: IUserResponse,
    @Param('activityId') activityId: string,
    @Body() dto: SaveReviewDto
  ): Promise<ActivityReview> {
    return this.commandHandler.execute(new SaveReview(actor, activityId, dto));
  }

  @Get('mine')
  findMine(@CurrentUser() actor: IUserResponse, @Query() query: IFilterReviews): Promise<[ActivityReview[], number]> {
    return this.queryHandler.execute(new FindMyReviews(actor.id, query));
  }

  @Get('activities/:activityId/statistics')
  statistics(@CurrentUser() actor: IUserResponse, @Param('activityId') activityId: string): Promise<IReviewStatistics> {
    return this.queryHandler.execute(new GetReviewStatistics(actor, activityId));
  }

  @Get('activities/:activityId')
  findForActivity(
    @CurrentUser() actor: IUserResponse,
    @Param('activityId') activityId: string,
    @Query() query: IFilterReviews
  ): Promise<[ActivityReview[], number]> {
    return this.queryHandler.execute(new FindActivityReviews(actor, activityId, query));
  }

  @Get(':id')
  findOne(@CurrentUser() actor: IUserResponse, @Param('id') id: string): Promise<ActivityReview> {
    return this.queryHandler.execute(new FindReviewById(actor, id));
  }

  @Patch(':id')
  update(
    @CurrentUser() actor: IUserResponse,
    @Param('id') id: string,
    @Body() dto: SaveReviewDto
  ): Promise<ActivityReview> {
    return this.commandHandler.execute(new UpdateReview(actor.id, id, dto));
  }

  @Delete(':id')
  remove(@CurrentUser() actor: IUserResponse, @Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteReview(actor, id));
  }
}
